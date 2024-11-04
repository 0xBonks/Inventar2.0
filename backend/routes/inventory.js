const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { inventorySchemas } = require('../validations/schemas');
const { getIO } = require('../socket');

// Get all inventory items
router.get('/', auth, async (req, res) => {
  try {
    const items = await Inventory.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new item
router.post('/', [auth, validate(inventorySchemas.create)], async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    getIO().emit('inventoryUpdate', { action: 'create', item });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update item
router.patch('/:id', [auth, validate(inventorySchemas.update)], async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update only the fields that are provided
    const updatedItem = await item.update({
      name: req.body.name || item.name,
      quantity: req.body.quantity || item.quantity,
      location: req.body.location || item.location,
      status: req.body.status || item.status
    });

    // Emit socket event with updated item
    getIO().emit('inventoryUpdate', { action: 'update', item: updatedItem });
    
    // Send back the updated item
    res.json(updatedItem);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      error: error.message,
      details: error.errors?.map(e => e.message)
    });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.destroy();
    getIO().emit('inventoryUpdate', { action: 'delete', itemId: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 