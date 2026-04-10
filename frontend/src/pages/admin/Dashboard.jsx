import React, { useState } from "react";
import * as Icons from "../../assets/icons/index";

// ── DỮ LIỆU MẪU ─────────────────────────────────────────────────────────────
const statsCards = [
  {
    id: 1,
    label: "Tổng doanh thu",
    value: "142.580.000 ₫",
    change: "+12.5%",
    positive: true,
    sub: "So với tháng trước",
    accent: "#2563eb",
    bg: "from-blue-50 to-blue-100/40",
    border: "border-blue-200",
    icon: Icons.Transaction,
  },
  {
    id: 2,
    label: "Đơn hàng mới",
    value: "384",
    change: "+8.2%",
    positive: true,
    sub: "Tháng này",
    accent: "#059669",
    bg: "from-emerald-50 to-emerald-100/40",
    border: "border-emerald-200",
    icon: Icons.Bill,
  },
  {
    id: 3,
    label: "Khách hàng",
    value: "1.240",
    change: "+3.1%",
    positive: true,
    sub: "Tổng đã đăng ký",
    accent: "#7c3aed",
    bg: "from-violet-50 to-violet-100/40",
    border: "border-violet-200",
    icon: Icons.Customers,
  },
  {
    id: 4,
    label: "Sản phẩm tồn kho",
    value: "58",
    change: "-4 sản phẩm",
    positive: false,
    sub: "Cần nhập thêm hàng",
    accent: "#dc2626",
    bg: "from-red-50 to-red-100/40",
    border: "border-red-200",
    icon: Icons.Inventory,
  },
];

const recentOrders = [
  { id: "#DH00184", customer: "Nguyễn Văn A", product: "iPhone 15 Pro Max", amount: "34.990.000 ₫", status: "success", date: "10/04/2025" },
  { id: "#DH00183", customer: "Trần Thị B",   product: "ASUS ROG Zephyrus",  amount: "42.500.000 ₫", status: "pending", date: "10/04/2025" },
  { id: "#DH00182", customer: "Lê Minh C",    product: "Samsung Galaxy S24", amount: "22.990.000 ₫", status: "success", date: "09/04/2025" },
  { id: "#DH00181", customer: "Phạm Thu D",   product: "Bàn phím Keychron",  amount: "1.890.000 ₫",  status: "shipping",date: "09/04/2025" },
  { id: "#DH00180", customer: "Hoàng Văn E",  product: "MacBook Air M3",     amount: "28.990.000 ₫", status: "cancelled",date:"08/04/2025" },
  { id: "#DH00179", customer: "Vũ Lan F",     product: "Tai nghe Sony WH",   amount: "3.490.000 ₫",  status: "success", date: "08/04/2025" },
];

const topProducts = [
  { name: "iPhone 15 Pro Max",   sold: 142, revenue: "4.963 tr",  pct: 88 },
  { name: "MacBook Air M3",      sold: 97,  revenue: "2.812 tr",  pct: 72 },
  { name: "ASUS ROG Zephyrus",   sold: 63,  revenue: "2.677 tr",  pct: 58 },
  { name: "Samsung Galaxy S24",  sold: 118, revenue: "2.712 tr",  pct: 65 },
  { name: "Keychron Q1 Pro",     sold: 204, revenue: "1.386 tr",  pct: 45 },
];

// Dữ liệu biểu đồ cột đơn giản (7 ngày gần nhất)
const chartData = [
  { day: "T2", value: 68, amount: "9.7tr" },
  { day: "T3", value: 82, amount: "11.8tr" },
  { day: "T4", value: 55, amount: "7.9tr" },
  { day: "T5", value: 91, amount: "13.1tr" },
  { day: "T6", value: 74, amount: "10.6tr" },
  { day: "T7", value: 110, amount: "15.8tr" },
  { day: "CN", value: 96, amount: "13.8tr" },
];

const maxChart = Math.max(...chartData.map(d => d.value));

// Tỉ lệ phân loại đơn theo trạng thái
const orderPie = [
  { label: "Thành công",  value: 61, color: "#10b981" },
  { label: "Đang giao",   value: 22, color: "#3b82f6" },
  { label: "Chờ xử lý",  value: 11, color: "#f59e0b" },
  { label: "Đã huỷ",     value: 6,  color: "#ef4444" },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const statusConfig = {
  success:   { label: "Thành công" },
  pending:   { label: "Chờ xử lý"  },
  shipping:  { label: "Đang giao"  },
  cancelled: { label: "Đã huỷ"    },
};

// ── COMPONENT ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Tính stroke-dasharray cho biểu đồ tròn đơn giản (CSS only)
  const r = 40;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="w-full min-h-full bg-[#f0f2f5] font-sans">
      {/* ── HEADER ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tổng quan hệ thống</h2>
        <p className="text-sm text-gray-500 mt-1">Thứ Năm, 10 tháng 4 năm 2025 &nbsp;·&nbsp; Dữ liệu cập nhật vừa xong</p>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card) => (
          <div
            key={card.id}
            className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
              style={{ backgroundColor: card.accent }}
            />
            {/* Icon slot */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: card.accent }}
            >
              <img
                src={card.icon}
                alt={card.label}
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-xl font-extrabold text-gray-900 leading-tight">{card.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  card.positive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}
              >
                {card.change}
              </span>
              <span className="text-[11px] text-gray-400">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 2: BIỂU ĐỒ CỘT + PHÂN LOẠI ĐƠN ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">

        {/* Biểu đồ doanh thu 7 ngày */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Doanh thu 7 ngày qua</h3>
              <p className="text-xs text-gray-400 mt-0.5">Đơn vị: triệu đồng</p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Tuần này</span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-2 h-40">
            {chartData.map((d, i) => {
              const heightPct = (d.value / maxChart) * 100;
              const isHovered = hoveredBar === i;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  <div className={`text-[10px] font-bold text-blue-600 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
                    {d.amount}
                  </div>
                  {/* Bar */}
                  <div className="w-full relative flex items-end" style={{ height: "120px" }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-200"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: isHovered ? "#2563eb" : "#bfdbfe",
                        minHeight: "8px",
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phân loại đơn hàng */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 text-base mb-1">Trạng thái đơn hàng</h3>
          <p className="text-xs text-gray-400 mb-5">Tháng 4 / 2025</p>

          {/* SVG Donut chart */}
          <div className="flex justify-center mb-5">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {orderPie.map((seg, i) => {
                  const pct = seg.value / 100;
                  const dash = pct * circ;
                  const gap  = circ - dash;
                  const offset = cumulative * circ;
                  cumulative += pct;
                  return (
                    <circle
                      key={i}
                      cx="50" cy="50" r={r}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="18"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-gray-800">384</span>
                <span className="text-[10px] text-gray-400 font-medium">đơn</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            {orderPie.map((seg, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs font-medium text-gray-600">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${seg.value}%`, backgroundColor: seg.color }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-7 text-right">{seg.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: ĐƠN HÀNG GẦN ĐÂY + TOP SẢN PHẨM ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Đơn hàng gần đây */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-base">Đơn hàng gần đây</h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
              Xem tất cả →
            </button>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm min-w-max">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Mã đơn</th>
                  <th className="px-6 py-3 text-left font-bold">Khách hàng</th>
                  <th className="px-6 py-3 text-left font-bold">Sản phẩm</th>
                  <th className="px-6 py-3 text-right font-bold">Tổng tiền</th>
                  <th className="px-6 py-3 text-center font-bold">Trạng thái</th>
                  <th className="px-6 py-3 text-right font-bold">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => {
                  const s = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-blue-600 text-xs">{order.id}</td>
                      <td className="px-6 py-3.5 font-semibold text-gray-800">{order.customer}</td>
                      <td className="px-6 py-3.5 text-gray-500 max-w-[160px] truncate">{order.product}</td>
                      <td className="px-6 py-3.5 text-right font-bold text-gray-800">{order.amount}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 uppercase">
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right text-gray-400 text-xs">{order.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top sản phẩm bán chạy */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-gray-800 text-base">Top sản phẩm</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tháng 4</span>
          </div>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0
                      ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 leading-tight">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 shrink-0 ml-2">{p.sold} cái</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 w-14 text-right">{p.revenue} ₫</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick summary */}
          <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold text-blue-700">624</p>
              <p className="text-[10px] text-blue-500 font-semibold mt-0.5">SL bán ra</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold text-emerald-700">14.5tr</p>
              <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Doanh thu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;