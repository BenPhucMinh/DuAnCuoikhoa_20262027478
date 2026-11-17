const express = require('express');
const router = express.Router();
const NhomATC = require('../models/NhomATC');

router.get('/', async (req, res) => {
  try {
    const data = await NhomATC.find({}).sort({ id: 1, ma_nhom: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
