let currentDate = new Date(); // 基準日

document.addEventListener("DOMContentLoaded", async () => {
  setupButtons();
  await renderWeek();
});

/* ===============================
   週移動ボタン
================================ */
function setupButtons() {
  document.getElementById("btnPrevWeek").onclick = async () => {
    currentDate.setDate(currentDate.getDate() - 7);
    await renderWeek();
  };

  document.getElementById("btnPrevDay").onclick = async () => {
    currentDate.setDate(currentDate.getDate() - 1);
    await renderWeek();
  };

  document.getElementById("btnThisWeek").onclick = async () => {
    currentDate = new Date();
    await renderWeek();
  };

  document.getElementById("btnNextDay").onclick = async () => {
    currentDate.setDate(currentDate.getDate() + 1);
    await renderWeek();
  };

  document.getElementById("btnNextWeek").onclick = async () => {
    currentDate.setDate(currentDate.getDate() + 7);
    await renderWeek();
  };
}

/* ===============================
   週表示の描画（改善版）
================================ */
async function renderWeek() {
  // 週の開始日（日曜）
  const weekStart = getWeekStart(currentDate);
  const weekDates = getWeekDates(weekStart);

  // 週の開始・終了を YYYY-MM-DD に変換
  const startStr = formatDate(weekDates[0]);
  const endStr = formatDate(weekDates[6]);

  // 日付表示
  weekDates.forEach((d, idx) => {
    const col = document.querySelector(`.day-column[data-day="${idx}"]`);
    col.querySelector(".date").textContent = `${d.getMonth() + 1}/${d.getDate()}`;
    col.querySelector(".events").innerHTML = "";
  });

  // 🔥 週の範囲でスケジュール取得（改善ポイント）
  const res = await fetch(`/schedules?start=${startStr}&end=${endStr}`);
  const schedules = await res.json();

  // スケジュール配置
  schedules.forEach(sch => {
    const date = new Date(sch.start_datetime);
    const weekday = date.getDay();

    const column = document.querySelector(`.day-column[data-day="${weekday}"] .events`);

    const start = sch.start_datetime.slice(11, 16);
    const end = sch.end_datetime ? sch.end_datetime.slice(11, 16) : "";

    const chip = document.createElement("div");
    chip.className = "event-chip";
    chip.style.backgroundColor = sch.color_code || "#888";

    chip.innerHTML = `
      <div class="chip-title">${sch.title}</div>
      <div class="chip-time">${start}${end ? " ～ " + end : ""}</div>
    `;

    chip.addEventListener("click", () => {
      window.location.href = `/schedules/${sch.schedule_id}`;
    });

    column.appendChild(chip);
  });
}

/* ===============================
   日付フォーマット YYYY-MM-DD
================================ */
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ===============================
   週開始日（日曜）
================================ */
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

/* ===============================
   週の7日間
================================ */
function getWeekDates(startDate) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(d);
  }
  return dates;
}