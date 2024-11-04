const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/status', auth, async (req, res) => {
  try {
    const items = await Inventory.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('item_id')), 'count']
      ],
      group: ['status']
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/low-stock', auth, async (req, res) => {
  try {
    const items = await Inventory.findAll({
      where: {
        status: 'Low'
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 