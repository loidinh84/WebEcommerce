const DonHang = require("../models/DonHang");
const ChiTietDonHang = require("../models/ChiTietDonHang");
const HoaDonDienTu = require("../models/HoaDonDienTu");
const DonViVanChuyen = require("../models/DonViVanChuyen");
const PhuongThucThanhToan = require("../models/PhuongThucThanhToan");
const db = require("../config/db");

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
      vat_info,
      receive_email,
    } = req.body;

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

    if (receive_email) {
      console.log(`Hệ thống sẽ gửi email xác nhận cho đơn hàng ${maDonHang}`);
    }

    // 3. Lưu danh sách sản phẩm vào ChiTietDonHang
    const orderDetails = items.map((item) => ({
      don_hang_id: newOrder.id,
      bien_the_id: item.variantId,
      ten_sp_luc_mua: item.ten_san_pham,
      sku_luc_mua: item.sku || `SKU-${item.variantId}`,
      so_luong: item.so_luong,
      don_gia: item.gia_ban,
      thanh_tien: item.gia_ban * item.so_luong,
    }));
    await ChiTietDonHang.bulkCreate(orderDetails, { transaction: t });

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

    res.status(201).json({
      message: "Đặt hàng thành công!",
      maDonHang: maDonHang,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng!" });
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
