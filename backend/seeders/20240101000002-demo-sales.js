module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    return queryInterface.bulkInsert('Sales', [
      {
        item_id: 1,
        quantity: 50,
        unit_price: 999.99,
        total_sale: 49999.50,
        customer: 'ABC Corp',
        createdAt: now,
        updatedAt: now
      },
      {
        item_id: 2,
        quantity: 25,
        unit_price: 1299.99,
        total_sale: 32499.75,
        customer: 'XYZ Inc',
        createdAt: now,
        updatedAt: now
      },
      // ... other sales ...
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sales', null, {});
  }
}; 