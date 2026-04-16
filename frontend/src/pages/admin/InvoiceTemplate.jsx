import React from "react";

const InvoiceTemplate = React.forwardRef(({ order }, ref) => {
  return (
    <div
      ref={ref}
      // Nền trắng, chữ đen tuyệt đối, font chữ cơ bản dễ đọc
      className="p-10 bg-white text-black font-sans w-[210mm] min-h-[297mm]"
    >
      {order && (
        <>
          {/* Header Hóa Đơn - Đổi hết chữ xanh thành đen */}
          <div className="flex justify-between items-start border-b-2 border-black pb-5 mb-8">
            <div>
              <h1 className="text-3xl font-black text-black">LTL STORE</h1>
              <p className="text-sm text-black font-medium">
                Công nghệ dẫn đầu - Niềm tin bền vững
              </p>
              <p className="text-xs mt-1">
                Địa chỉ: 123 Đường 3/2, Ninh Kiều, Cần Thơ
              </p>
              <p className="text-xs">Hotline: 0333 914 513</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold uppercase">Hóa Đơn Bán Hàng</h2>
              <p className="text-sm font-medium">
                Mã ĐH: <span className="font-bold">{order.id}</span>
              </p>
              <p className="text-sm">
                Ngày in: {new Date().toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Thông tin khách hàng - Dùng viền đen mỏng */}
          <div className="grid grid-cols-2 gap-10 mb-8 text-sm text-black">
            <div className="p-4 border border-black rounded">
              <p className="font-bold uppercase mb-2 text-xs border-b border-dashed border-black pb-1">
                Người nhận hàng
              </p>
              <p className="font-bold text-base">{order.customerName}</p>
              <p>SĐT: {order.phone}</p>
              <p className="mt-1 italic">{order.address}</p>
            </div>
            <div className="p-4 border border-black rounded">
              <p className="font-bold uppercase mb-2 text-xs border-b border-dashed border-black pb-1">
                Thanh toán
              </p>
              <p>
                Phương thức:{" "}
                <span className="font-bold">{order.paymentMethod}</span>
              </p>
              <p>
                Trạng thái:{" "}
                <span className="font-bold">{order.paymentStatus}</span>
              </p>
              <p className="mt-1 italic">Ghi chú: {order.note || "Không có"}</p>
            </div>
          </div>

          {/* Bảng sản phẩm - Bỏ nền đen, dùng viền rõ ràng */}
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="text-black text-sm uppercase border-b-2 border-black">
                <th className="py-2 px-2 text-left font-bold">STT</th>
                <th className="py-2 px-2 text-left font-bold">Sản phẩm</th>
                <th className="py-2 px-2 text-center font-bold">SL</th>
                <th className="py-2 px-2 text-right font-bold">Đơn giá</th>
                <th className="py-2 px-2 text-right font-bold">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {order.items?.map((item, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">
                    <span className="font-bold">{item.name}</span> <br />
                    <span className="text-xs italic">
                      Phân loại: {item.variant}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">{item.qty}</td>
                  <td className="py-3 px-2 text-right">
                    {new Intl.NumberFormat("vi-VN").format(item.price)}
                  </td>
                  <td className="py-3 px-2 text-right font-bold">
                    {new Intl.NumberFormat("vi-VN").format(
                      item.price * item.qty,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tổng kết tiền bạc */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-black">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(
                    order.total - (order.shippingFee || 0),
                  )}
                  đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span>
                  +
                  {new Intl.NumberFormat("vi-VN").format(
                    order.shippingFee || 0,
                  )}
                  đ
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-black pt-2 uppercase">
                <span>Tổng cộng:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(order.total)}đ
                </span>
              </div>
            </div>
          </div>

          {/* Chữ ký */}
          <div className="mt-16 grid grid-cols-2 text-center text-sm text-black">
            <div>
              <p className="font-bold">Khách hàng</p>
              <p className="text-xs italic">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold">Người lập hóa đơn</p>
              <p className="font-bold mt-16">Admin LTL Store</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default InvoiceTemplate;
