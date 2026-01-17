document.addEventListener("DOMContentLoaded", async () => {
  const scheduleId = window.location.pathname.split("/").pop();

  const res = await fetch(`/schedules/${scheduleId}/api`);
  const sch = await res.json();

  const detail = document.getElementById("detail");

  const start = sch.start_datetime.slice(11, 16);
  const end = sch.end_datetime ? sch.end_datetime.slice(11, 16) : "";

  detail.innerHTML = `
    <p><strong>タイトル：</strong> ${sch.title}</p>
    <p><strong>日時：</strong> ${start}${end ? " ～ " + end : ""}</p>
    <p><strong>場所：</strong> ${sch.location || ""}</p>
    <p><strong>メモ：</strong> ${sch.memo || ""}</p>
    <p><strong>色：</strong> ${sch.color_name}</p>
  `;

  document.getElementById("editBtn").onclick = () => {
    location.href = `/schedules/${scheduleId}/edit`;
  };

  document.getElementById("deleteBtn").onclick = async () => {
    if (!confirm("削除しますか？")) {
      return;
    }

    await fetch(`/schedules/${scheduleId}`, { method: "DELETE" });
    location.href = "/";
  };
});