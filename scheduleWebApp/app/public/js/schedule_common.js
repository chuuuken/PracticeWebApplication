/* ============================
   時刻セレクト生成
============================ */
export function buildHourOptions(select) {
  select.innerHTML = '<option value="">--</option>';
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, "0");
    select.innerHTML += `<option value="${hh}">${hh}</option>`;
  }
}

export function buildMinuteOptions(select) {
  select.innerHTML = '<option value="">--</option>';
  [0, 15, 30, 45].forEach(m => {
    const mm = String(m).padStart(2, "0");
    select.innerHTML += `<option value="${mm}">${mm}</option>`;
  });
}

/* ============================
   ユーザー一覧取得
============================ */
export async function fetchUsers() {
  return await fetch("/users").then(res => res.json());
}

/* ============================
   色一覧取得
============================ */
export async function loadColors(select) {
  const colors = await fetch("/colors").then(res => res.json());
  colors.forEach(c => {
    select.innerHTML += `<option value="${c.color_name}" style="background:${c.color_code}">${c.color_name}</option>`;
  });
}

/* ============================
   チップ生成
============================ */
export function addParticipantChip(userId, userName, chipContainer, rebuildSelectBoxes) {
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.dataset.userid = userId;
  chip.innerHTML = `${userName} <button>×</button>`;

  chip.querySelector("button").onclick = () => {
    chip.remove();
    document.getElementById("hidden-" + userId)?.remove();
    rebuildSelectBoxes();
  };

  chipContainer.appendChild(chip);

  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = "participants[]";
  hidden.value = userId;
  hidden.id = "hidden-" + userId;
  chipContainer.appendChild(hidden);
}

/* ============================
   プルダウン再生成
============================ */
export function rebuildSelectBoxesBase(users, createdBySelect, participantsSelect, chipContainer) {
  const selectedCreator = createdBySelect.value;

  const selectedParticipants = [...chipContainer.querySelectorAll(".chip")].map(
    chip => chip.dataset.userid
  );

  // 登録者
  createdBySelect.innerHTML = '<option value="">選択してください</option>';
  users.forEach(u => {
    if (!selectedParticipants.includes(u.user_id)) {
      createdBySelect.innerHTML += `<option value="${u.user_id}">${u.name}</option>`;
    }
  });
  createdBySelect.value = selectedCreator;

  // 同報者
  participantsSelect.innerHTML = '<option value="">選択してください</option>';
  users.forEach(u => {
    if (u.user_id !== selectedCreator && !selectedParticipants.includes(u.user_id)) {
      participantsSelect.innerHTML += `<option value="${u.user_id}">${u.name}</option>`;
    }
  });
}