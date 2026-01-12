const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// 一覧取得
router.get('/', async (req, res) => {
  try {
    const users = await usersController.getAll();
    res.json(users);
  } catch (err) {
    console.error("users getAll error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 詳細取得
router.get('/:id', async (req, res) => {
  try {
    const user = await usersController.getDetail(req.params.id);
    res.json(user);
  } catch (err) {
    console.error("users getDetail error:", err);
    res.status(500).json({ error: "Failed to fetch user detail" });
  }
});

// 新規登録
router.post('/', async (req, res) => {
  try {
    await usersController.create(req.body);
    res.redirect("/user_register.html");
  } catch (err) {
    console.error("users create error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// 削除
router.delete('/:id', async (req, res) => {
  try {
    await usersController.remove(req.params.id);
    res.json({ message: "deleted" });
  } catch (err) {
    console.error("users remove error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;