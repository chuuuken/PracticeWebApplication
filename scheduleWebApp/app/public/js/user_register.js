document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("userForm");
  const userIdInput = document.getElementById("user_id");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");

  const showError = (msg) => {
    alert(msg); // 必要なら画面内に赤字表示に変更可能
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user_id = userIdInput.value.trim();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value.trim();

    // ===============================
    // 入力チェック
    // ===============================
    if (!user_id) return showError("ユーザIDは必須です");
    if (!name) return showError("ユーザ名は必須です");

    if (email && !email.match(/^[\w\.-]+@[\w\.-]+\.\w+$/)) {
      return showError("メールアドレスの形式が不正です");
    }

    // ===============================
    // 重複チェック
    // ===============================
    const exists = await fetch(`/users/${user_id}`).then(r => r.json()).catch(() => null);
    if (exists && exists.user_id) {
      return showError("このユーザIDは既に登録されています");
    }

    // ===============================
    // 登録処理
    // ===============================
    try {
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, name, email, role })
      });

      if (!res.ok) throw new Error("登録に失敗しました");

      alert("登録しました");
      location.href = "/"; // トップへ戻る

    } catch (err) {
      showError(err.message);
    }
  });
});