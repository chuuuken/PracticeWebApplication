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
   週表示の描画
================================ */
async function renderWeek() {
  const weekStart = getWeekStart(currentDate);
  const weekDates = getWeekDates(weekStart);

  // 日付表示
  weekDates.forEach((d, idx) => {
    document.querySelector(`.date[data-day="${idx}"]`).textContent =
      `${d.getMonth() + 1}/${d.getDate()}`;
  });

  // メンバー一覧取得
  const users = await fetch("/users").then(res => res.json());
  users.sort((a, b) => a.user_id.localeCompare(b.user_id));

  // メンバー行生成
  const tbody = document.getElementById("member-rows");
  tbody.innerHTML = "";

  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.dataset.userid = u.user_id;

    // 左端：メンバー名
    const th = document.createElement("th");
    th.textContent = u.name;
    tr.appendChild(th);

    // 曜日セル 7列
    for (let day = 0; day < 7; day++) {
      const td = document.createElement("td");
      td.id = `cell-${u.user_id}-${day}`;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });

  // スケジュール取得
  const startStr = formatDate(weekDates[0]);
  const endStr = formatDate(weekDates[6]);

  let schedules = await fetch(`/schedules?start=${startStr}&end=${endStr}`)
    .then(res => res.json());

  // ===============================
  // ★ 時間順にソート（レベル3）
  // ===============================
  schedules.sort((a, b) => {
    return new Date(a.start_datetime) - new Date(b.start_datetime);
  });

  // ===============================
  // スケジュール配置
  // ===============================
  for (const sch of schedules) {
    const start = new Date(sch.start_datetime);
    const weekday = start.getDay();

    // 参加者一覧取得
    const usersInSchedule = await fetch(`/schedules/${sch.schedule_id}/users`)
      .then(res => res.json());

    usersInSchedule.forEach(u => {
      const cell = document.getElementById(`cell-${u.user_id}-${weekday}`);
      if (!cell) {
        return;
      }

      const chip = document.createElement("div");
      chip.className = "event-chip";
      chip.style.backgroundColor = sch.color_code || "#888";

      const startTime = sch.start_datetime.slice(11, 16);
      const endTime = sch.end_datetime ? sch.end_datetime.slice(11, 16) : "";

      chip.innerHTML = `
        <div><strong>${sch.title}</strong></div>
        <div>${startTime}${endTime ? " ～ " + endTime : ""}</div>
      `;

      chip.addEventListener("dblclick", () => {
        window.location.href = `/schedules/${sch.schedule_id}/edit`;
      });

      cell.appendChild(chip);
    });
  }

  // ===============================
  // 行の高さ同期
  // ===============================
  syncRowHeights();

  // ===============================
  // チップの高さ統一
  // ===============================
  syncChipHeights();
}

/* ===============================
   行の高さ同期
================================ */
function syncRowHeights() {
  const rows = document.querySelectorAll("#member-rows tr");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");

    // 一旦高さリセット
    cells.forEach(c => c.style.height = "auto");

    // 最大高さを取得
    let maxHeight = 0;
    cells.forEach(c => {
      const h = c.offsetHeight;
      if (h > maxHeight) {
        maxHeight = h;
      }
    });

    // 全セルに最大高さを適用
    cells.forEach(c => c.style.height = maxHeight + "px");
  });
}

/* ===============================
   チップの高さ統一
================================ */
function syncChipHeights() {
  // 曜日ごとに処理（0〜6）
  for (let day = 0; day < 7; day++) {
    const chips = document.querySelectorAll(`td[id$="-${day}"] .event-chip`);

    if (chips.length === 0) {
      continue;
    }

    // 一旦リセット
    chips.forEach(chip => chip.style.height = "auto");

    // 最大高さを取得
    let maxHeight = 0;
    chips.forEach(chip => {
      const h = chip.offsetHeight;
      if (h > maxHeight) {
        maxHeight = h;
      }
    });

    // 全チップに最大高さを適用
    chips.forEach(chip => {
      chip.style.height = maxHeight + "px";
    });
  }
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