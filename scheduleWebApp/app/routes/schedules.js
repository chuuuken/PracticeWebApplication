const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedulesController');
const multer = require('multer');
const upload = multer();

// ===============================
// RESTful ルーティング
// ===============================

// 一覧取得
router.get('/', schedulesController.getAll);

// 新規登録
router.post('/', upload.none(), schedulesController.create);

// 詳細 API
router.get('/:id/api', schedulesController.getDetailAPI);

// 参加者 API
router.get('/:id/users', schedulesController.getUsers);

// 編集画面
router.get('/:id/edit', schedulesController.getEditPage);

// 更新
router.put('/:id', upload.none(), schedulesController.update);

// 削除
router.delete('/:id', schedulesController.remove);

// 詳細画面（最後に置く）
router.get('/:id', schedulesController.getDetailPage);

module.exports = router;
