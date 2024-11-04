const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userSchemas } = require('../validations/schemas');

router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      console.log('Email already exists:', req.body.email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'Manager'
    });

    console.log('User created successfully:', user.email);

    // Generate token
    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
      expiresIn: 86400 // 24 hours in seconds
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Registration failed',
      details: error.errors?.map(e => e.message)
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = user.toJSON();
    delete userResponse.password;

    console.log('Login successful for:', email);

    res.json({
      user: userResponse,
      token,
      expiresIn: 86400 // 24 hours in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/validate', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.json({ valid: false });
    }
    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

module.exports = router; 