import {
  buildHourOptions,
  buildMinuteOptions,
  fetchUsers,
  loadColors,
  addParticipantChip,
  rebuildSelectBoxesBase
} from "./schedule_common.js";

document.addEventListener("DOMContentLoaded", async () => {

  // ===============================
  // DOM 取得（未定義問題の修正）
  // ===============================
  const createdBySelect = document.getElementById("createdBySelect");
  const participantsSelect = document.getElementById("participantsSelect");
  const chipContainer = document.getElementById("chipContainer");
  const colorSelect = document.getElementById("colorSelect");

  const startHour = document.getElementById("startHour");
  const startMinute = document.getElementById("startMinute");
  const endHour = document.getElementById("endHour");
  const endMinute = document.getElementById("endMinute");

  // ===============================
  // 時刻セレクト生成
  // ===============================
  buildHourOptions(startHour);
  buildMinuteOptions(startMinute);
  buildHourOptions(endHour);
  buildMinuteOptions(endMinute);

  // ===============================
  // ユーザー一覧取得
  // ===============================
  const users = await fetchUsers();

  const rebuildSelectBoxes = () =>
    rebuildSelectBoxesBase(users, createdBySelect, participantsSelect, chipContainer);

  // 初期生成
  rebuildSelectBoxes();

  // ===============================
  // 同報者追加
  // ===============================
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

  // ===============================
  // 色一覧
  // ===============================
  await loadColors(colorSelect);
});