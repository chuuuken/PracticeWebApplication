require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();

// ===============================
// ミドルウェア設定
// ===============================

// POST（application/x-www-form-urlencoded）
app.use(express.urlencoded({ extended: true }));

// JSON 受け取り
app.use(express.json());

// PUT / DELETE を HTML フォームで使うため
app.use(methodOverride("_method"));

// 静的ファイル（public 配下）
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// ルーティング
// ===============================
const schedulesRouter = require("./routes/schedules");
const usersRouter = require("./routes/users");
const colorsRouter = require("./routes/colors");

app.use("/schedules", schedulesRouter);
app.use("/users", usersRouter);
app.use("/colors", colorsRouter);

// ===============================
// ルート（トップページ）
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 404 ハンドリング
// ===============================
app.use((req, res) => {
  res.status(404).send("ページが見つかりません");
});

// ===============================
// サーバ起動
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});