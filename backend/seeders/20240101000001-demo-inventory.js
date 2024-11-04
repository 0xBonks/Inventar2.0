module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    return queryInterface.bulkInsert('Inventories', [
      {
        name: 'iPhone 15',
        quantity: 150,
        price: 999.99,
        location: 'North',
        status: 'In Stock',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Samsung TV 65"',
        quantity: 5,
        price: 1299.99,
        location: 'South',
        status: 'Low',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'MacBook Pro',
        quantity: 0,
        price: 1999.99,
        location: 'East',
        status: 'Out',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Designer Jeans',
        quantity: 200,
        price: 89.99,
        location: 'West',
        status: 'In Stock',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Running Shoes',
        quantity: 8,
        price: 129.99,
        location: 'North',
        status: 'Low',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Coffee Maker',
        quantity: 45,
        price: 79.99,
        location: 'South',
        status: 'In Stock',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Garden Tools Set',
        quantity: 3,
        price: 149.99,
        location: 'East',
        status: 'Low',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Yoga Mat',
        quantity: 75,
        price: 29.99,
        location: 'West',
        status: 'In Stock',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Dumbbells Set',
        quantity: 0,
        price: 199.99,
        location: 'North',
        status: 'Out',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Bestseller Novel',
        quantity: 120,
        price: 19.99,
        location: 'South',
        status: 'In Stock',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Office Supplies',
        quantity: 4,
        price: 49.99,
        location: 'East',
        status: 'Low',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Art Supplies',
        quantity: 25,
        price: 89.99,
        location: 'West',
        status: 'In Stock',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Inventories', null, {});
  }
}; 