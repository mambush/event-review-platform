const { sequelize } = require('./models');

async function syncDatabase() {
  try {
    // This will create tables if they don't exist
    // The {force: true} option would drop existing tables first (be careful with this!)
    await sequelize.sync();
    console.log('Database synchronized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to synchronize database:', error);
    process.exit(1);
  }
}

syncDatabase();