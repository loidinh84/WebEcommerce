import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Đang tải dữ liệu...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((res) => {
        console.log("Dữ liệu từ server:", res.data);
        setMessage(res.data);
      })
      .catch((err) => {
        console.error("Lỗi kết nối server:", err);
        setMessage("Không thể kết nối đến server!");
      });
  }, []);

  return (
    <div>
      <h1>Chào mừng đến với cửa hàng đồ công nghệ của chúng tôi!</h1>
      <p>Thông báo từ Server: <strong>{message}</strong></p>
    </div>
  );
}

export default App;
