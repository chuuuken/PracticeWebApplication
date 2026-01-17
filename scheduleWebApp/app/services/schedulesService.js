const db = require("../config/db");

/* ============================================================
   ユーティリティ：時刻結合
   date: "2025-01-10"
   hour: "09"
   minute: "30"
   → "2025-01-10 09:30:00"
============================================================ */
function buildDateTime(date, hour, minute) {
  if (!date || !hour || !minute) {
    return null;
  }
  return `${date} ${hour}:${minute}:00`;
}

/* ============================================================
   参加者配列を正規化
============================================================ */
function normalizeParticipants(p) {
  if (!p) {
    return [];
  }
  if (Array.isArray(p)) {
    return p;
  }
  return [p]; // 単一選択時は string になるため
}

/* ============================================================
   全件取得
============================================================ */
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT s.*, c.color_code
       FROM schedules s
       LEFT JOIN colors c ON s.color_name = c.color_name
       ORDER BY s.start_datetime`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

/* ============================================================
   期間指定取得
============================================================ */
exports.getByDateRange = (start, end) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT s.*, c.color_code
       FROM schedules s
       LEFT JOIN colors c ON s.color_name = c.color_name
       WHERE DATE(s.start_datetime) BETWEEN ? AND ?
       ORDER BY s.start_datetime`,
      [start, end],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

/* ============================================================
   詳細取得
============================================================ */
exports.getDetail = (scheduleId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT s.*, c.color_code
       FROM schedules s
       LEFT JOIN colors c ON s.color_name = c.color_name
       WHERE s.schedule_id = ?`,
      [scheduleId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0] || null);
      }
    );
  });
};

/* ============================================================
   参加者取得
============================================================ */
exports.getUsers = (scheduleId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT u.user_id, u.name
       FROM user_schedule us
       JOIN users u ON us.user_id = u.user_id
       WHERE us.schedule_id = ?
       ORDER BY u.user_id`,
      [scheduleId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

/* ============================================================
   新規登録
============================================================ */
exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const {
      title,
      date,
      startHour,
      startMinute,
      endHour,
      endMinute,
      location,
      memo,
      color_name,
      created_by,
      recurring_rule_id
    } = data;

    const start_datetime = buildDateTime(date, startHour, startMinute);
    const end_datetime =
      endHour && endMinute ? buildDateTime(date, endHour, endMinute) : null;

    db.query(
      `INSERT INTO schedules
       (title, start_datetime, end_datetime, location, memo, color_name, created_by, recurring_rule_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        start_datetime,
        end_datetime,
        location || null,
        memo || null,
        color_name || null,
        created_by,
        recurring_rule_id || null
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);
      }
    );
  });
};

/* ============================================================
   参加者設定（登録者 + 同報者）
============================================================ */
exports.setParticipants = (scheduleId, createdBy, participantsRaw) => {
  return new Promise((resolve, reject) => {
    const participants = normalizeParticipants(participantsRaw);

    // まず既存削除
    db.query(
      "DELETE FROM user_schedule WHERE schedule_id = ?",
      [scheduleId],
      (err) => {
        if (err) {
          return reject(err);
        }

        // 登録者を追加
        const values = [[createdBy, scheduleId]];

        // 同報者を追加
        participants.forEach((p) => {
          values.push([p, scheduleId]);
        });

        db.query(
          "INSERT INTO user_schedule (user_id, schedule_id) VALUES ?",
          [values],
          (err2) => {
            if (err2) {
              return reject(err2);
            }
            resolve();
          }
        );
      }
    );
  });
};

/* ============================================================
   更新
============================================================ */
exports.update = (scheduleId, data) => {
  return new Promise((resolve, reject) => {
    const {
      title,
      date,
      startHour,
      startMinute,
      endHour,
      endMinute,
      location,
      memo,
      color_name,
      created_by,
      recurring_rule_id
    } = data;

    const start_datetime = buildDateTime(date, startHour, startMinute);
    const end_datetime =
      endHour && endMinute ? buildDateTime(date, endHour, endMinute) : null;

    db.query(
      `UPDATE schedules
       SET title = ?, start_datetime = ?, end_datetime = ?, location = ?, memo = ?, color_name = ?, created_by = ?, recurring_rule_id = ?
       WHERE schedule_id = ?`,
      [
        title,
        start_datetime,
        end_datetime,
        location || null,
        memo || null,
        color_name || null,
        created_by,
        recurring_rule_id || null,
        scheduleId
      ],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
};

/* ============================================================
   削除
============================================================ */
exports.remove = (scheduleId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM schedules WHERE schedule_id = ?",
      [scheduleId],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
};