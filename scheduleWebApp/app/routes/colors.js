const express = require('express');
const router = express.Router();
const colorsController = require('../controllers/colorsController');
//const multer = require('multer');
//const upload = multer();

// 一覧取得
router.get('/', colorsController.getAll);

// 詳細取得
router.get('/:id', colorsController.getDetail);

// 新規登録
router.post('/', colorsController.create);

// 削除
router.delete('/:id', colorsController.remove);

module.exports = router;