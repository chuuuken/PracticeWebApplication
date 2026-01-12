const connection = require('../config/db');

// ===============================
// 一覧取得
// ===============================
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users ORDER BY user_id`;
    connection.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// ===============================
// 詳細取得
// ===============================
exports.getDetail = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    connection.query(sql, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
};

// ===============================
// 新規登録
// ===============================
exports.create = (body) => {
  return new Promise((resolve, reject) => {
    const { user_id, name, email, role } = body;

    const sql = `
      INSERT INTO users (user_id, name, email, role)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(sql, [user_id, name, email, role], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// ===============================
// 削除
// ===============================
exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    connection.query(sql, [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};