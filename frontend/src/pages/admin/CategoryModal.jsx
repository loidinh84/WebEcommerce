import React, { useState, useEffect } from "react";

// Hàm tự động tạo slug từ tên tiếng Việt
const generateSlug = (str) => {
  const map = {
    à:'a',á:'a',â:'a',ã:'a',ä:'a',å:'a',
    è:'e',é:'e',ê:'e',ë:'e',
    ì:'i',í:'i',î:'i',ï:'i',
    ò:'o',ó:'o',ô:'o',õ:'o',ö:'o',ø:'o',
    ù:'u',ú:'u',û:'u',ü:'u',
    ý:'y',ÿ:'y',
    ñ:'n',ç:'c',
    // Tiếng Việt
    à:'a',á:'a',ả:'a',ã:'a',ạ:'a',
    ă:'a',ằ:'a',ắ:'a',ẳ:'a',ẵ:'a',ặ:'a',
    â:'a',ầ:'a',ấ:'a',ẩ:'a',ẫ:'a',ậ:'a',
    đ:'d',
    è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',
    ê:'e',ề:'e',ế:'e',ể:'e',ễ:'e',ệ:'e',
    ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
    ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',
    ô:'o',ồ:'o',ố:'o',ổ:'o',ỗ:'o',ộ:'o',
    ơ:'o',ờ:'o',ớ:'o',ở:'o',ỡ:'o',ợ:'o',
    ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',
    ư:'u',ừ:'u',ứ:'u',ử:'u',ữ:'u',ự:'u',
    ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',
  };
  return str
    .toLowerCase()
    .split('')
    .map(c => map[c] || c)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
};

const EMPTY_FORM = { name: "", slug: "", parent: "", order: 1, status: "active", desc: "" };

const CategoryModal = ({ isOpen, onClose, data, allCategories, onSave }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setFormData(data);
        setSlugManuallyEdited(true); // Khi edit: giữ nguyên slug gốc, không auto-overwrite
      } else {
        setFormData(EMPTY_FORM);
        setSlugManuallyEdited(false);
      }
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData(prev => ({
        ...prev,
        name: value,
        // Chỉ auto-gen slug nếu người dùng chưa tự sửa slug
        slug: slugManuallyEdited ? prev.slug : generateSlug(value),
      }));
    } else if (name === "slug") {
      // Người dùng tự sửa slug → không auto-gen nữa
      setSlugManuallyEdited(true);
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegenerateSlug = () => {
    setSlugManuallyEdited(false);
    setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  // Không cho phép chọn chính nó làm cha
  const validParentOptions = allCategories.filter(c => c.id !== data?.id);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            {data ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h3>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500 cursor-pointer transition-colors leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">

          {/* Tên danh mục */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-widest">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              name="name" value={formData.name} onChange={handleChange} required
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-semibold transition-all"
              placeholder="VD: Điện thoại di động"
            />
          </div>

          {/* Slug — hiển thị kết quả auto-gen, có nút re-gen */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Slug (URL)</label>
              <button
                type="button" onClick={handleRegenerateSlug}
                className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"
              >
                ↺ Tạo lại từ tên
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-gray-400 text-xs shrink-0">/danh-muc/</span>
              <input
                name="slug" value={formData.slug} onChange={handleChange}
                type="text"
                className="flex-1 bg-transparent outline-none text-sm font-mono text-gray-700 min-w-0"
                placeholder="tu-dong-tao-tu-ten"
              />
            </div>
          </div>

          {/* Danh mục cha + Thứ tự */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Danh mục cha</label>
              <select
                name="parent" value={formData.parent || ""} onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-semibold cursor-pointer transition-all text-sm"
              >
                <option value="">— Danh mục gốc</option>
                {validParentOptions.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Thứ tự hiển thị</label>
              <input
                name="order" value={formData.order} onChange={handleChange}
                type="number" min="1"
                className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-semibold transition-all"
              />
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Trạng thái hiển thị</label>
            <div className="flex gap-4">
              {[
                { value: "active",   label: "Hiển thị", color: "green" },
                { value: "inactive", label: "Ẩn",        color: "red"   },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer font-bold text-sm transition-all
                    ${formData.status === opt.value
                      ? opt.color === "green"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-400 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio" name="status" value={opt.value}
                    checked={formData.status === opt.value}
                    onChange={handleChange} className="hidden"
                  />
                  <span className={`w-2 h-2 rounded-full ${formData.status === opt.value ? (opt.color === "green" ? "bg-green-500" : "bg-red-500") : "bg-gray-300"}`} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Mô tả <span className="font-normal normal-case">(không bắt buộc)</span></label>
            <textarea
              name="desc" value={formData.desc} onChange={handleChange}
              rows="3"
              className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-medium text-sm transition-all resize-none"
              placeholder="Mô tả ngắn về danh mục này..."
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-3 bg-white border border-gray-300 text-gray-600 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 cursor-pointer"
            >
              {data ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;