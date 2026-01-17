const db = require('../config/db');

// ===============================
// 一覧取得
// ===============================
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users ORDER BY user_id`;
    db.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// ===============================
// 詳細取得
// ===============================
exports.getDetail = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    db.query(sql, [id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
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

    db.query(sql, [user_id, name, email, role], (err) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// ===============================
// 削除
// ===============================
exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    db.query(sql, [id], (err) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};