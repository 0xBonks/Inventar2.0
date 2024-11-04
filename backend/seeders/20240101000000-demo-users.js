const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const now = new Date();

    return queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Admin',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: hashedPassword,
        role: 'Manager',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
}; 