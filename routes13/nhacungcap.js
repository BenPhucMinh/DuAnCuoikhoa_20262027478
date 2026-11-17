const express = require('express');
const router = express.Router();
const NhaCungCap = require('../models/NhaCungCap');

router.get('/', async (req, res) => {
  try {
    const data = await NhaCungCap.find({}).sort({ id: 1, id_ncc: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
