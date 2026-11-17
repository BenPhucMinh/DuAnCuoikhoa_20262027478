const express = require('express');
const router = express.Router();
const Thuoc = require('../models/Thuoc');

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const data = await Thuoc.find({}).sort({ STT: 1, stt: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search by name
router.get('/search/:name', async (req, res) => {
  try {
    const data = await Thuoc.find({
      $or: [
        { TEN_THANH_PHAM: { $regex: req.params.name, $options: 'i' } },
        { ten_thanh_pham: { $regex: req.params.name, $options: 'i' } },
        { TEN_HOAT_CHAT: { $regex: req.params.name, $options: 'i' } },
        { ten_hoat_chat: { $regex: req.params.name, $options: 'i' } }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

