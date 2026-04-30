const SanPham = require("../models/SanPham");
const { Op } = require("sequelize");

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
    
    // Nếu Meilisearch lỗi mạng và trả về undefined hoặc không có hits
    if (!result || !result.hits) {
      throw new Error("Meilisearch không phản hồi hợp lệ");
    }
    
    return result;
  } catch (error) {
    console.error("Lỗi search bằng Meilisearch, chuyển sang SQL fallback:", error.message);
    
    // Fallback sang SQL Search
    try {
      const whereCondition = { trang_thai: "active" };
      if (query && query.trim() !== "") {
        whereCondition.ten_san_pham = { [Op.like]: `%${query}%` };
      }
      
      const sqlResults = await SanPham.findAll({
        where: whereCondition,
        attributes: [
          "id",
          "ten_san_pham",
          "mo_ta_ngan",
          "thuong_hieu",
          "slug",
        ],
        limit: limit,
      });
      
      return { hits: sqlResults, estimatedTotalHits: sqlResults.length };
    } catch (sqlError) {
      console.error("Lỗi SQL fallback:", sqlError.message);
      return { hits: [] };
    }
  }
};

module.exports = { syncDataToMeilisearch, searchSanPham };
