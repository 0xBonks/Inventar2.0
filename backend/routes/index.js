const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const inventoryRoutes = require('./inventory');
const reportRoutes = require('./reports');

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);

module.exports = router; 