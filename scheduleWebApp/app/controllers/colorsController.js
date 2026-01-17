const db = require("../config/db");

// ===============================
// 全件取得
// ===============================
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT color_id, color_name, color_code FROM colors ORDER BY color_id",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

// ===============================
// 詳細取得
// ===============================
exports.getDetail = (colorId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT color_id, color_name, color_code FROM colors WHERE color_id = ?",
      [colorId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] || null);
      }
    );
  });
};

// ===============================
// 新規登録
// ===============================
exports.create = ({ color_name, color_code }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO colors (color_name, color_code)
       VALUES (?, ?)`,
      [color_name, color_code],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);
      }
    );
  });
};

// ===============================
// 削除
// ===============================
exports.remove = (colorId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM colors WHERE color_id = ?",
      [colorId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows);
      }
    );
  });
};