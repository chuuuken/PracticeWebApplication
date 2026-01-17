import {
  buildHourOptions,
  buildMinuteOptions,
  fetchUsers,
  loadColors,
  addParticipantChip,
  rebuildSelectBoxesBase
} from "./schedule_common.js";

document.addEventListener("DOMContentLoaded", async () => {

  /* ===============================
     URL から scheduleId を取得
  =============================== */
  const match = window.location.pathname.match(/\/schedules\/(\d+)\/edit/);
  const scheduleId = match ? match[1] : null;

  if (!scheduleId) {
    alert("スケジュールIDが取得できませんでした");
    return;
  }

  /* ===============================
     DOM 取得
  =============================== */
  const createdBySelect = document.getElementById("createdBySelect");
  const participantsSelect = document.getElementById("participantsSelect");
  const chipContainer = document.getElementById("chipContainer");
  const colorSelect = document.getElementById("colorSelect");

  const startHour = document.getElementById("startHour");
  const startMinute = document.getElementById("startMinute");
  const endHour = document.getElementById("endHour");
  const endMinute = document.getElementById("endMinute");

  const title = document.getElementById("title");
  const date = document.getElementById("date");
  const location = document.getElementById("location");
  const memo = document.getElementById("memo");

  /* ===============================
     時刻セレクト生成
  =============================== */
  buildHourOptions(startHour);
  buildMinuteOptions(startMinute);
  buildHourOptions(endHour);
  buildMinuteOptions(endMinute);

  /* ===============================
     ユーザー一覧取得
  =============================== */
  const users = await fetchUsers();
  const rebuildSelectBoxes = () =>
    rebuildSelectBoxesBase(users, createdBySelect, participantsSelect, chipContainer);

  /* ===============================
     色一覧
  =============================== */
  await loadColors(colorSelect);

  /* ===============================
     スケジュール詳細取得
  =============================== */
  const sch = await fetch(`/schedules/${scheduleId}/api`).then(res => res.json());

  /* ===============================
     基本項目セット
  =============================== */
  title.value = sch.title;
  date.value = sch.start_datetime.slice(0, 10);
  location.value = sch.location || "";
  memo.value = sch.memo || "";
  colorSelect.value = sch.color_name;

  /* ===============================
     時刻セット
  =============================== */
  const [sh, sm] = sch.start_datetime.slice(11, 16).split(":");
  startHour.value = sh;
  startMinute.value = sm;

  if (sch.end_datetime) {
    const [eh, em] = sch.end_datetime.slice(11, 16).split(":");
    endHour.value = eh;
    endMinute.value = em;
  }

  /* ===============================
     参加者取得
  =============================== */
  const userLinks = await fetch(`/schedules/${scheduleId}/users`).then(res => res.json());

  // 先に登録者をセット
  createdBySelect.value = sch.created_by;

  // 再構築（登録者を除外しないようにこの順序が重要）
  rebuildSelectBoxes();

  // 同報者チップ生成
  userLinks.forEach(u => {
    if (u.user_id !== sch.created_by) {
      addParticipantChip(u.user_id, u.name, chipContainer, rebuildSelectBoxes);
    }
  });

  // 最終的に再構築
  rebuildSelectBoxes();

  /* ===============================
     登録者変更時の排他制御
  =============================== */
  createdBySelect.addEventListener("change", rebuildSelectBoxes);

  /* ===============================
     同報者追加
  =============================== */
  participantsSelect.addEventListener("change", () => {
    const userId = participantsSelect.value;
    if (!userId) {
      return;
    }

    const userName = participantsSelect.options[participantsSelect.selectedIndex].text;

    addParticipantChip(userId, userName, chipContainer, rebuildSelectBoxes);

    participantsSelect.value = "";
    rebuildSelectBoxes();
  });

  /* ===============================
     更新処理
  =============================== */
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // 同報者（hidden input）
    data["participants[]"] = [...document.querySelectorAll("#chipContainer input")]
      .map(i => i.value);

    // 日付 + 時刻を結合
    data.start_datetime = `${data.date} ${data.startHour}:${data.startMinute}:00`;
    data.end_datetime =
      data.endHour && data.endMinute
        ? `${data.date} ${data.endHour}:${data.endMinute}:00`
        : null;

    try {
      await fetch(`/schedules/${scheduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      alert("更新しました");
      location.href = "/";
    } catch (err) {
      alert("更新に失敗しました");
      console.error(err);
    }
  });
});