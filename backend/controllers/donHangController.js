const db = require("../config/db");
const { Op } = require("sequelize");
const DonHang = require("../models/DonHang");
const ChiTietDonHang = require("../models/ChiTietDonHang");
const HoaDonDienTu = require("../models/HoaDonDienTu");
const DonViVanChuyen = require("../models/DonViVanChuyen");
const PhuongThucThanhToan = require("../models/PhuongThucThanhToan");
const BienTheSanPham = require("../models/BienTheSanPham");
const KhuyenMai = require("../models/KhuyenMai");
const LichSuDungVoucher = require("../models/LichSuDungVoucher");
const TaiKhoan = require("../models/TaiKhoan");
const emailService = require("../services/emailService");
const TheThanhVien = require("../models/TheThanhVien");
const GiaoDichThanhToan = require("../models/GiaoDichThanhToan");
const DiaChiGiaoHang = require("../models/DiaChiGiaoHang");
const ThietLapCuaHang = require("../models/ThietLapCuaHang");

exports.createDonHang = async (req, res) => {
  const t = await db.transaction();

  try {
    const {
      tai_khoan_id,
      dia_chi_id,
      don_vi_vc_id,
      tong_tien_hang,
      phi_van_chuyen,
      tien_giam_gia,
      tong_thanh_toan,
      ghi_chu,
      phuong_thuc_tt,
      items,
      voucher_code,
      vat_info,
      receive_email,
    } = req.body;

    let voucherData = null;
    // --- KIỂM TRA VOUCHER ---
    if (voucher_code) {
      voucherData = await KhuyenMai.findOne({
        where: { ma_khuyen_mai: voucher_code, trang_thai: "active" },
        transaction: t,
      });
      if (!voucherData)
        throw new Error("Mã giảm giá không tồn tại hoặc đã hết hạn!");

      // 1. Kiểm tra thời gian
      const now = new Date();
      if (now < voucherData.ngay_bat_dau || now > voucherData.ngay_ket_thuc) {
        throw new Error("Mã giảm giá hiện không trong thời gian sử dụng!");
      }

      // 2. Kiểm tra số lượng mã tổng quát
      if (voucherData.da_su_dung >= voucherData.so_luong_ma) {
        throw new Error("Mã giảm giá đã hết lượt sử dụng!");
      }

      // 3.Chặn mỗi người dùng chỉ dùng 1 lần
      const usageCount = await LichSuDungVoucher.count({
        where: { tai_khoan_id, khuyen_mai_id: voucherData.id },
        transaction: t,
      });
      if (usageCount > 0) {
        throw new Error(
          "Bạn đã sử dụng mã giảm giá này cho một đơn hàng trước đó!",
        );
      }
    }

    const config = await ThietLapCuaHang.findOne({
      where: { id: 1 },
      transaction: t,
    });

    const generateOrderCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let storeName =
        config && config.ten_cua_hang ? config.ten_cua_hang : "HD";
      let prefix = storeName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .substring(0, 8);
      let result = `${prefix}-`;
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // 1. Tạo mã đơn hàng tự động
    const maDonHang = generateOrderCode();

    let final_thanh_toan = tong_thanh_toan;
    if (config && config.lam_tron_tien) {
      final_thanh_toan = Math.round(tong_thanh_toan / 1000) * 1000;
    }

    const phuongThucDinhDanh = await PhuongThucThanhToan.findByPk(
      phuong_thuc_tt,
      {
        transaction: t,
      },
    );

    let initialStatus = "pending";

    if (
      config &&
      config.tu_dong_duyet_don &&
      phuongThucDinhDanh &&
      phuongThucDinhDanh.loai === "cod"
    ) {
      initialStatus = "confirmed";
    }

    // 2. Lưu vào bảng DonHang
    const newOrder = await DonHang.create(
      {
        ma_don_hang: maDonHang,
        tai_khoan_id,
        dia_chi_id,
        don_vi_vc_id,
        tong_tien_hang,
        phi_van_chuyen,
        tong_thanh_toan: final_thanh_toan,
        tien_giam_gia: Math.round(tien_giam_gia || 0),
        trang_thai: initialStatus,
        ghi_chu: ghi_chu || "",
        created_at: new Date(),
      },
      { transaction: t },
    );

    await GiaoDichThanhToan.create(
      {
        don_hang_id: newOrder.id,
        phuong_thuc_id: phuong_thuc_tt,
        so_tien: final_thanh_toan,
        trang_thai: "cho_thanh_toan",
        ngay_tao: new Date(),
      },
      { transaction: t },
    );

    if (voucherData) {
      await voucherData.update(
        { da_su_dung: voucherData.da_su_dung + 1 },
        { transaction: t },
      );
      await LichSuDungVoucher.create(
        {
          tai_khoan_id,
          khuyen_mai_id: voucherData.id,
          don_hang_id: newOrder.id,
        },
        { transaction: t },
      );
    }

    // 2. Xử lý từng sản phẩm: Kiểm tra kho + Trừ tồn kho
    const orderDetailsData = [];

    for (const item of items) {
      const bienThe = await BienTheSanPham.findByPk(item.variantId, {
        transaction: t,
      });

      if (!bienThe || bienThe.ton_kho < item.so_luong) {
        throw new Error(
          `Sản phẩm ${item.ten_san_pham} đã hết hàng hoặc không đủ số lượng!`,
        );
      }

      const tonKhoCu = bienThe.ton_kho;
      const tonKhoMoi = tonKhoCu - item.so_luong;

      // Trừ kho
      await bienThe.update({ ton_kho: tonKhoMoi }, { transaction: t });

      if (config && config.nguong_bao_het_hang) {
        if (
          tonKhoCu > config.nguong_bao_het_hang &&
          tonKhoMoi <= config.nguong_bao_het_hang
        ) {
          emailService
            .sendLowStockAlert({
              productName: item.ten_san_pham,
              variantName:
                `${item.dung_luong || ""} ${item.mau_sac || ""}`.trim(),
              remaining: tonKhoMoi,
              threshold: config.nguong_bao_het_hang,
            })
            .catch((err) => console.log("Lỗi gửi mail báo hết hàng:", err));
        }
      }

      // Đẩy dữ liệu vào mảng để dùng bulkCreate
      orderDetailsData.push({
        don_hang_id: newOrder.id,
        bien_the_id: item.variantId,
        ten_sp_luc_mua: item.ten_san_pham,
        sku_luc_mua: item.sku || `SKU-${item.variantId}`,
        so_luong: item.so_luong,
        don_gia: item.gia_ban,
        thanh_tien: item.gia_ban * item.so_luong,
      });
    }

    // 3. Lưu toàn bộ chi tiết đơn hàng
    await ChiTietDonHang.bulkCreate(orderDetailsData, { transaction: t });

    // 4. Nếu khách yêu cầu VAT, lưu vào bảng HoaDonDienTu
    if (vat_info && vat_info.ten_cong_ty) {
      await HoaDonDienTu.create(
        {
          don_hang_id: newOrder.id,
          ten_nguoi_mua: vat_info.ten_cong_ty,
          ma_so_thue: vat_info.mst,
          dia_chi_nguoi_mua: vat_info.dia_chi_cty,
          tong_tien_chua_vat: tong_tien_hang,
          tien_vat: tong_tien_hang * 0.1,
          tong_tien_vat: tong_tien_hang * 1.1,
          ngay_xuat: new Date(),
        },
        { transaction: t },
      );
    }

    await t.commit();

    const taiKhoan = await TaiKhoan.findByPk(tai_khoan_id);

    try {
      const tongChiTieuMoi =
        Number(taiKhoan.tong_chi_tieu || 0) + Number(final_thanh_toan);

      const hangMoi = await TheThanhVien.findOne({
        where: { muc_chi_tieu_tu: { [Op.lte]: tongChiTieuMoi } },
        order: [["muc_chi_tieu_tu", "DESC"]],
      });

      await taiKhoan.update({
        tong_chi_tieu: tongChiTieuMoi,
        the_thanh_vien_id: hangMoi ? hangMoi.id : taiKhoan.the_thanh_vien_id,
      });
    } catch (err) {
      console.log("Lỗi cập nhật thẻ thành viên:", err);
    }

    if (config && config.gui_email_tu_dong) {
      const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      const addressText = ghi_chu.includes("Địa chỉ:")
        ? ghi_chu
        : "Xem trong lịch sử đơn hàng";

      const orderInfoForEmail = {
        customerName: taiKhoan?.ho_ten || "Khách hàng",
        maDonHang: maDonHang,
        total: currencyFormatter.format(final_thanh_toan),
        paymentMethod:
          phuongThucDinhDanh.loai === "cod" ? "Tiền mặt (COD)" : "Chuyển khoản",
        address: addressText,
      };

      if (taiKhoan && taiKhoan.email) {
        emailService
          .sendOrderConfirmation(taiKhoan.email, orderInfoForEmail)
          .catch((err) => console.log("Lỗi gửi mail cho khách:", err));
      }

      emailService
        .sendNewOrderNotification(orderInfoForEmail)
        .catch((err) => console.log("Lỗi gửi mail cho admin:", err));
    }

    res.status(201).json({
      message: "Đặt hàng thành công!",
      maDonHang: maDonHang,
    });
  } catch (error) {
    await t.rollback();
    res
      .status(400)
      .json({ message: error.message || "Lỗi hệ thống khi tạo đơn hàng!" });
  }
};

exports.checkVoucher = async (req, res) => {
  try {
    const { code, userId, totalAmount } = req.body;

    const voucher = await KhuyenMai.findOne({
      where: { ma_khuyen_mai: code, trang_thai: "active" },
    });

    if (!voucher)
      return res.status(404).json({ message: "Mã giảm giá không tồn tại!" });

    // 1. Kiểm tra thời gian
    const now = new Date();
    if (now < voucher.ngay_bat_dau || now > voucher.ngay_ket_thuc) {
      return res.status(400).json({
        message: "Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng!",
      });
    }

    // 2. Kiểm tra số lượng tổng
    if (voucher.da_su_dung >= voucher.so_luong_ma) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã hết lượt sử dụng!" });
    }

    // 3. Kiểm tra đơn hàng tối thiểu
    if (totalAmount < voucher.don_hang_toi_thieu) {
      return res.status(400).json({
        message: `Đơn hàng tối thiểu phải từ ${voucher.don_hang_toi_thieu}đ để dùng mã này!`,
      });
    }

    // 4. KIỂM TRA DÙNG 1 LẦN
    const used = await LichSuDungVoucher.findOne({
      where: { tai_khoan_id: userId, khuyen_mai_id: voucher.id },
    });
    if (used) {
      return res.status(400).json({ message: "Bạn đã sử dụng mã này rồi!" });
    }

    res.json({
      message: "Áp dụng mã thành công!",
      discount: {
        id: voucher.id,
        loai: voucher.loai,
        gia_tri: voucher.gia_tri,
        gia_tri_toi_da: voucher.gia_tri_toi_da,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi kiểm tra voucher!" });
  }
};

// Admin
exports.getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      fromDate,
      toDate,
    } = req.query;

    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { ma_don_hang: { [Op.like]: `%${search}%` } },
        { "$dia_chi.ho_ten_nguoi_nhan$": { [Op.like]: `%${search}%` } },
        { "$dia_chi.so_dien_thoai$": { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "all") {
      whereCondition.trang_thai = status;
    }

    if (fromDate || toDate) {
      whereCondition.created_at = {};
      if (fromDate) whereCondition.created_at[Op.gte] = new Date(fromDate);
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        whereCondition.created_at[Op.lte] = endDate;
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await DonHang.findAndCountAll({
      where: whereCondition,
      include: [
        { model: DiaChiGiaoHang, as: "dia_chi" },
        { model: ChiTietDonHang, as: "chi_tiet" },
        {
          model: GiaoDichThanhToan,
          as: "giao_dich",
          include: [{ model: PhuongThucThanhToan, as: "phuong_thuc" }],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
      distinct: true,
      subQuery: false,
    });

    // Format dữ liệu
    const formattedOrders = orders.map((order) => {
      const diaChi = order.dia_chi || {};
      if (Array.isArray(order.giao_dich) && order.giao_dich.length > 0) {
        giaoDich = order.giao_dich[0];
      } else if (order.giao_dich && !Array.isArray(order.giao_dich)) {
        giaoDich = order.giao_dich;
      }

      const giaoDich = order.giao_dich || {};
      const phuongThuc = giaoDich.phuong_thuc || {};

      // Xử lý ngày tháng thành chuỗi dd/mm/yyyy HH:MM
      const d = new Date(order.created_at);
      const dateStr = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;

      // Xử lý chuỗi địa chỉ
      const fullAddress = [
        diaChi.dia_chi_cu_the,
        diaChi.phuong_xa,
        diaChi.quan_huyen,
        diaChi.tinh_thanh,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        id: order.ma_don_hang,
        customerName: diaChi.ho_ten_nguoi_nhan || "Khách vãng lai",
        phone: diaChi.so_dien_thoai || "Chưa cập nhật",
        address: fullAddress || "Chưa cập nhật",
        date: dateStr,
        total: order.tong_thanh_toan,
        shippingFee: order.phi_van_chuyen,
        discount: order.tien_giam_gia,
        voucherCode: order.voucher_code,
        subTotal: order.tong_tien_hang,
        note: order.ghi_chu,
        paymentMethod: phuongThuc.ten_phuong_thuc || "COD",
        paymentStatus:
          giaoDich.trang_thai === "thanh_cong"
            ? "Đã thanh toán"
            : "Chưa thanh toán",
        orderStatus: order.trang_thai,
        items: order.chi_tiet.map((item) => ({
          name: item.ten_sp_luc_mua,
          variant: item.sku_luc_mua,
          qty: item.so_luong,
          price: item.don_gia,
        })),
      };
    });

    res.status(200).json({
      orders: formattedOrders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      totalItems: count,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng" });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    // Tìm đơn hàng trong DB
    const donHang = await DonHang.findOne({ where: { ma_don_hang: id } });

    if (!donHang) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng này!" });
    }

    // Không cho phép đổi trạng thái nếu đơn đã Hủy hoặc Hoàn thành
    if (
      donHang.trang_thai === "cancelled" ||
      donHang.trang_thai === "delivered"
    ) {
      return res
        .status(400)
        .json({ message: "Đơn hàng đã đóng, không thể thay đổi trạng thái!" });
    }

    if (trang_thai === "cancelled") {
      if (donHang.trang_thai === "shipping") {
        return res.status(400).json({
          message: "Đơn hàng đã được giao cho Shipper, không thể hủy!",
        });
      }
    }

    donHang.trang_thai = trang_thai;
    donHang.update_at = new Date();
    await donHang.save();

    res.status(200).json({
      message: "Cập nhật trạng thái thành công!",
      data: donHang,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái!" });
  }
};
