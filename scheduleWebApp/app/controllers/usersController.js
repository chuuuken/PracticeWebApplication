const db = require("../config/db");

// ===============================
// 全件取得
// ===============================
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users ORDER BY user_id", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ===============================
// 詳細取得
// ===============================
exports.getDetail = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      }
    );
  });
};

// ===============================
// 新規登録
// ===============================
exports.create = ({ user_id, name, email, role }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (user_id, name, email, role)
       VALUES (?, ?, ?, ?)`,
      [user_id, name, email, role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

// ===============================
// 削除
// ===============================
exports.remove = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM users WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      }
    );
  });
};