const schedulesService = require("../services/schedulesService");
const path = require("path");

/* ============================================================
   participants[] を正規化
============================================================ */
function normalizeParticipants(p) {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  return [p]; // 単一選択時は string になるため
}

/* ============================================================
   一覧取得（週の範囲指定にも対応）
   GET /schedules?start=YYYY-MM-DD&end=YYYY-MM-DD
============================================================ */
exports.getAll = async (req, res) => {
  try {
    const { start, end } = req.query;

    let schedules;
    if (start && end) {
      schedules = await schedulesService.getByDateRange(start, end);
    } else {
      schedules = await schedulesService.getAll();
    }

    res.json(schedules);
  } catch (err) {
    console.error("getAll error:", err);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
};

/* ============================================================
   新規登録
   POST /schedules
============================================================ */
exports.create = async (req, res) => {
  try {
    // participants[] を正規化
    const participants = normalizeParticipants(req.body["participants[]"]);

    // スケジュール登録
    const scheduleId = await schedulesService.create(req.body);

    // 参加者設定（登録者 + 同報者）
    await schedulesService.setParticipants(
      scheduleId,
      req.body.created_by,
      participants
    );

    res.redirect("/");
  } catch (err) {
    console.error("create error:", err);
    res.status(500).send("Failed to create schedule");
  }
};

/* ============================================================
   詳細ページ（HTML）
   GET /schedules/:id
============================================================ */
exports.getDetailPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "schedule_detail.html"));
};

/* ============================================================
   詳細 API（JSON）
   GET /schedules/:id/api
============================================================ */
exports.getDetailAPI = async (req, res) => {
  try {
    const schedule = await schedulesService.getDetail(req.params.id);
    res.json(schedule);
  } catch (err) {
    console.error("getDetailAPI error:", err);
    res.status(500).json({ error: "Failed to fetch schedule detail" });
  }
};

/* ============================================================
   参加者 API
   GET /schedules/:id/users
============================================================ */
exports.getUsers = async (req, res) => {
  try {
    const users = await schedulesService.getUsers(req.params.id);
    res.json(users);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ error: "Failed to fetch schedule users" });
  }
};

/* ============================================================
   編集ページ（HTML）
   GET /schedules/:id/edit
============================================================ */
exports.getEditPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "schedule_edit.html"));
};

/* ============================================================
   更新
   PUT /schedules/:id
============================================================ */
exports.update = async (req, res) => {
  try {
    // participants[] を正規化
    const participants = normalizeParticipants(req.body["participants[]"]);

    // スケジュール更新
    await schedulesService.update(req.params.id, req.body);

    // 参加者更新
    await schedulesService.setParticipants(
      req.params.id,
      req.body.created_by,
      participants
    );

    res.json({ message: "updated" });
  } catch (err) {
    console.error("update error:", err);
    res.status(500).json({ error: "Failed to update schedule" });
  }
};

/* ============================================================
   削除
   DELETE /schedules/:id
============================================================ */
exports.remove = async (req, res) => {
  try {
    await schedulesService.remove(req.params.id);
    res.json({ message: "deleted" });
  } catch (err) {
    console.error("remove error:", err);
    res.status(500).json({ error: "Failed to delete schedule" });
  }
};