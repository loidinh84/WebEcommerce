const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOrderConfirmation = async (email, orderInfo) => {
  const mailOptions = {
    from: '"LTLShop" <dinhhoangloibt@gmail.com>',
    to: email,
    subject: `XÁC NHẬN ĐƠN HÀNG #${orderInfo.maDonHang}`,
    html: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #e30019;">Cảm ơn ${orderInfo.customerName} đã mua hàng!</h2>
        <p>Đơn hàng <b>${orderInfo.maDonHang}</b> đã được tạo thành công.</p>
        <hr/>
        <p>Tổng tiền: <b style="color: red;">${orderInfo.total} VNĐ</b></p>
        <p>Phương thức: <b>${orderInfo.paymentMethod}</b></p>
        <p>Địa chỉ giao: ${orderInfo.address}</p>
        <hr/>
        <p>Nhân viên LTLShop sẽ sớm liên hệ với bạn để xác nhận.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};
