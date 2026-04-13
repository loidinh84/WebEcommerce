const db = require("../config/db");
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

      // 3. QUAN TRỌNG: Chặn mỗi người dùng chỉ dùng 1 lần
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

    const generateOrderCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let result = "LTL";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // 1. Tạo mã đơn hàng tự động
    const maDonHang = generateOrderCode();

    // 2. Lưu vào bảng DonHang
    const newOrder = await DonHang.create(
      {
        ma_don_hang: maDonHang,
        tai_khoan_id,
        dia_chi_id,
        don_vi_vc_id,
        tong_tien_hang,
        phi_van_chuyen,
        tong_thanh_toan,
        tien_giam_gia: tien_giam_gia || 0,
        trang_thai: "pending",
        ghi_chu: ghi_chu || "",
        created_at: new Date(),
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
      if (!bienThe || bienThe.so_luong < item.so_luong) {
        throw new Error(
          `Sản phẩm ${item.ten_san_pham} đã hết hàng hoặc không đủ số lượng!`,
        );
      }
      // Trừ kho
      await bienThe.update(
        { so_luong: bienThe.so_luong - item.so_luong },
        { transaction: t },
      );

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
        Number(taiKhoan.tong_chi_tieu || 0) + Number(tong_thanh_toan);

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

    if (taiKhoan && taiKhoan.email && receive_email) {
      const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      const addressText = ghi_chu.includes("Địa chỉ:")
        ? ghi_chu
        : "Xem trong lịch sử đơn hàng";

      emailService
        .sendOrderConfirmation(taiKhoan.email, {
          customerName: taiKhoan.ho_ten,
          maDonHang: maDonHang,
          total: currencyFormatter.format(tong_thanh_toan),
          paymentMethod:
            phuong_thuc_tt === 1 ? "Tiền mặt (COD)" : "Chuyển khoản",
          address: addressText,
        })
        .catch((err) => console.log("Lỗi gửi mail:", err));
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

exports.getAllShippingUnits = async (req, res) => {
  const list = await DonViVanChuyen.findAll({
    where: { trang_thai: "active" },
  });
  res.json(list);
};

exports.getAllPaymentMethods = async (req, res) => {
  const list = await PhuongThucThanhToan.findAll({
    where: { trang_thai: "active" },
  });
  res.json(list);
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
