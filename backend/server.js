const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test web thành lợi!");
});

app.listen(5000, () => console.log("Server chạy tại port 5000"));