const connection = require('../config/db');

// ===============================
// 一覧取得
// ===============================
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM colors ORDER BY color_id`;
    connection.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// ===============================
// 詳細取得
// ===============================
exports.getDetail = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM colors WHERE color_id = ?`;
    connection.query(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
};

// ===============================
// 新規登録
// ===============================
exports.create = (body) => {
  return new Promise((resolve, reject) => {
    const { color_name, color_code } = body;

    const sql = `
      INSERT INTO colors (color_name, color_code)
      VALUES (?, ?)
    `;

    connection.query(sql, [color_name, color_code], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// ===============================
// 削除
// ===============================
exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM colors WHERE color_id = ?`;
    connection.query(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};