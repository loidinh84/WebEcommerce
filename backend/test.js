require("dotenv").config();

async function checkModels() {
  console.log("Đang kiểm tra API Key của ông chủ...");
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log(
      "LỖI: Chưa đọc được file .env hoặc mất API Key rồi ông chủ ơi!",
    );
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    if (data.error) {
      console.log("LỖI TỪ GOOGLE:", data.error.message);
    } else {
      console.log("THÀNH CÔNG! Các model ông chủ được phép dùng là:");
      data.models.forEach((m) => console.log("-", m.name));
    }
  } catch (err) {
    console.log("Lỗi mạng:", err.message);
  }
}

checkModels();
