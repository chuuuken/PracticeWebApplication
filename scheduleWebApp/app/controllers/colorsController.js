const colorsService = require("../services/colorsService");

exports.getAll = async (req, res) => {
  try {
    const colors = await colorsService.getAll();
    res.json(colors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
};

exports.getDetail = async (req, res) => {
  try {
    const color = await colorsService.getDetail(req.params.id);
    res.json(color);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch color detail" });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await colorsService.create(req.body);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create color" });
  }
};

exports.remove = async (req, res) => {
  try {
    await colorsService.remove(req.params.id);
    res.json({ message: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete color" });
  }
};