const db = require("../config/db");

/* ============================================================
   ユーティリティ関数
   ============================================================ */

// ------------------------------
// 日付 + 時刻 → DATETIME 文字列
// ------------------------------
function buildDateTime(date, hour, minute) {
  if (!hour || !minute) return null;
  return `${date} ${hour}:${minute}:00`;
}

// ------------------------------
// 参加者リストを正規化
// created_by を必ず含め、重複排除
// ------------------------------
function normalizeParticipants(created_by, participants) {
  let list = [];

  if (Array.isArray(participants)) {
    list = participants;
  } else if (participants) {
    list = [participants];
  }

  return [created_by, ...new Set(list)];
}

// ------------------------------
// user_schedule 削除
// ------------------------------
function deleteUserSchedule(scheduleId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM user_schedule WHERE schedule_id = ?`;
    db.query(sql, [scheduleId], (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

// ------------------------------
// user_schedule 追加
// ------------------------------
function insertUserSchedule(scheduleId, userList) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO user_schedule (user_id, schedule_id)
      VALUES ?
    `;
    const values = userList.map(uid => [uid, scheduleId]);

    db.query(sql, [values], (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

/* ============================================================
   メインサービス
   ============================================================ */

// ------------------------------
// 全件取得（色コード JOIN）
// ------------------------------
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.*, c.color_code
      FROM schedules s
      LEFT JOIN colors c ON s.color_name = c.color_name
      ORDER BY s.start_datetime
    `;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ------------------------------
// 日付範囲で取得（週移動用）
// ------------------------------
exports.getByDateRange = (start, end) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.*, c.color_code
      FROM schedules s
      LEFT JOIN colors c ON s.color_name = c.color_name
      WHERE s.start_datetime BETWEEN ? AND ?
      ORDER BY s.start_datetime
    `;
    db.query(
      sql,
      [`${start} 00:00:00`, `${end} 23:59:59`],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

// ------------------------------
// 詳細取得
// ------------------------------
exports.getDetail = (scheduleId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.*, c.color_code
      FROM schedules s
      LEFT JOIN colors c ON s.color_name = c.color_name
      WHERE s.schedule_id = ?
    `;
    db.query(sql, [scheduleId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

// ------------------------------
// 参加者一覧取得
// ------------------------------
exports.getUsers = (scheduleId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.user_id, u.name
      FROM user_schedule us
      JOIN users u ON us.user_id = u.user_id
      WHERE us.schedule_id = ?
      ORDER BY u.user_id
    `;
    db.query(sql, [scheduleId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ------------------------------
// 新規登録
// ------------------------------
exports.create = ({
  created_by,
  title,
  date,
  start_hour,
  start_minute,
  end_hour,
  end_minute,
  location,
  memo,
  color_name
}) => {
  return new Promise((resolve, reject) => {
    const start_datetime = buildDateTime(date, start_hour, start_minute);
    const end_datetime = buildDateTime(date, end_hour, end_minute);

    const sql = `
      INSERT INTO schedules
      (created_by, title, start_datetime, end_datetime, location, memo, color_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        created_by,
        title,
        start_datetime,
        end_datetime,
        location,
        memo,
        color_name
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

// ------------------------------
// 更新
// ------------------------------
exports.update = (scheduleId, {
  created_by,
  title,
  date,
  start_hour,
  start_minute,
  end_hour,
  end_minute,
  location,
  memo,
  color_name
}) => {
  return new Promise((resolve, reject) => {
    const start_datetime = buildDateTime(date, start_hour, start_minute);
    const end_datetime = buildDateTime(date, end_hour, end_minute);

    const sql = `
      UPDATE schedules
      SET created_by = ?, title = ?, start_datetime = ?, end_datetime = ?,
          location = ?, memo = ?, color_name = ?
      WHERE schedule_id = ?
    `;
    db.query(
      sql,
      [
        created_by,
        title,
        start_datetime,
        end_datetime,
        location,
        memo,
        color_name,
        scheduleId
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      }
    );
  });
};

// ------------------------------
// 削除
// ------------------------------
exports.remove = (scheduleId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM schedules WHERE schedule_id = ?`;
    db.query(sql, [scheduleId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

// ------------------------------
// 参加者設定（登録者 + 同報者）
// ------------------------------
exports.setParticipants = async (scheduleId, created_by, participants) => {
  const userList = normalizeParticipants(created_by, participants);

  await deleteUserSchedule(scheduleId);
  await insertUserSchedule(scheduleId, userList);

  return true;
};