module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sales', {
      sale_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Inventories',
          key: 'item_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_sale: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      customer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sales');
  }
}; 