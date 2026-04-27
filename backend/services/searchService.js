const SanPham = require("../models/SanPham");

const MEILI_HOST = process.env.MEILI_HOST;
const MEILI_KEY = process.env.MEILI_API_KEY;

const meiliRequest = async (method, path, body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MEILI_KEY}`,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${MEILI_HOST}${path}`, options);
  return res.json();
};

const syncDataToMeilisearch = async () => {
  try {
    console.log("Đang lấy dữ liệu từ SQL Server...");
    const products = await SanPham.findAll({
      where: { trang_thai: "active" },
      raw: true,
    });

    if (products.length === 0) {
      console.log("Không có sản phẩm nào để đồng bộ.");
      return;
    }

    const result = await meiliRequest(
      "POST",
      "/indexes/san_pham/documents?primaryKey=id",
      products,
    );
    console.log(`Đã đẩy ${products.length} sản phẩm!`, result);

    await meiliRequest("PATCH", "/indexes/san_pham/settings", {
      searchableAttributes: ["ten_san_pham", "mo_ta_ngan", "thuong_hieu"],
      filterableAttributes: ["danh_muc_id", "trang_thai", "thuong_hieu"],
    });
    console.log("Cấu hình Meilisearch hoàn tất.");
  } catch (error) {
    console.warn("Meili sync lỗi (server vẫn chạy):", error.message);
  }
};

const searchSanPham = async (query, { limit = 10, filter = null } = {}) => {
  try {
    const body = {
      q: query,
      limit,
      attributesToRetrieve: [
        "id",
        "ten_san_pham",
        "mo_ta_ngan",
        "thuong_hieu",
        "slug",
      ],
    };
    if (filter) body.filter = filter;
    const result = await meiliRequest("POST", "/indexes/san_pham/search", body);
    return result;
  } catch (error) {
    console.error("Lỗi search:", error.message);
    return { hits: [] };
  }
};

module.exports = { syncDataToMeilisearch, searchSanPham };
