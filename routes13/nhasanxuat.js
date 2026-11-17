const express = require('express');
const router = express.Router();
const NhaSanXuat = require('../models/NhaSanXuat');

router.get('/', async (req, res) => {
  try {
    const data = await NhaSanXuat.find({}).sort({ id: 1, id_nsx: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
