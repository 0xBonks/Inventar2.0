const request = require('supertest');
const app = require('../server');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

describe('Inventory Routes', () => {
  let token;

  beforeAll(async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin'
      });
    token = userRes.body.token;
  });

  beforeEach(async () => {
    await Inventory.destroy({ where: {} });
  });

  describe('POST /api/inventory', () => {
    it('should create new inventory item', async () => {
      const res = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Item',
          quantity: 10,
          location: 'Warehouse A',
          status: 'In Stock'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Item');
    });
  });

  describe('GET /api/inventory', () => {
    it('should return all inventory items', async () => {
      await Inventory.create({
        name: 'Test Item',
        quantity: 10,
        location: 'Warehouse A',
        status: 'In Stock'
      });

      const res = await request(app)
        .get('/api/inventory')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
    });
  });
}); 