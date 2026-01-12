import {
  buildHourOptions,
  buildMinuteOptions,
  fetchUsers,
  loadColors,
  addParticipantChip,
  rebuildSelectBoxesBase
} from "./schedule_common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const scheduleId = window.location.pathname.split("/")[2];

  const createdBySelect = document.getElementById("createdBySelect");
  const participantsSelect = document.getElementById("participantsSelect");
  const chipContainer = document.getElementById("chipContainer");
  const colorSelect = document.getElementById("colorSelect");

  // 時刻セレクト
  buildHourOptions(startHour);
  buildMinuteOptions(startMinute);
  buildHourOptions(endHour);
  buildMinuteOptions(endMinute);

  // ユーザー一覧
  const users = await fetchUsers();

  const rebuildSelectBoxes = () =>
    rebuildSelectBoxesBase(users, createdBySelect, participantsSelect, chipContainer);

  // 色一覧
  await loadColors(colorSelect);

  // 既存データ
  const sch = await fetch(`/schedules/${scheduleId}/api`).then(res => res.json());

  title.value = sch.title;
  date.value = sch.start_datetime.slice(0, 10);
  location.value = sch.location || "";
  memo.value = sch.memo || "";
  colorSelect.value = sch.color_name;

  const [sh, sm] = sch.start_datetime.slice(11, 16).split(":");
  startHour.value = sh;
  startMinute.value = sm;

  if (sch.end_datetime) {
    const [eh, em] = sch.end_datetime.slice(11, 16).split(":");
    endHour.value = eh;
    endMinute.value = em;
  }

  // 参加者
  const userLinks = await fetch(`/schedules/${scheduleId}/users`).then(res => res.json());

  userLinks.forEach(u => {
    if (u.user_id === sch.created_by) {
      createdBySelect.value = u.user_id;
    } else {
      addParticipantChip(u.user_id, u.name, chipContainer, rebuildSelectBoxes);
    }
  });

  rebuildSelectBoxes();

  // 同報者追加
  participantsSelect.addEventListener("change", () => {
    const userId = participantsSelect.value;
    if (!userId) return;

    const userName = participantsSelect.options[participantsSelect.selectedIndex].text;
    addParticipantChip(userId, userName, chipContainer, rebuildSelectBoxes);

    participantsSelect.value = "";
    rebuildSelectBoxes();
  });
});