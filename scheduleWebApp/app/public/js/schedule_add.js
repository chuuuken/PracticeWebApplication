import {
  buildHourOptions,
  buildMinuteOptions,
  fetchUsers,
  loadColors,
  addParticipantChip,
  rebuildSelectBoxesBase
} from "./schedule_common.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  createdBySelect.addEventListener("change", rebuildSelectBoxes);

  // 色一覧
  await loadColors(colorSelect);
});