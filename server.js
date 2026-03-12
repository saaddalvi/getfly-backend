require('dotenv').config();

const app = require('./src/app');
const sequelize = require('./src/config/database');

require('./src/models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync();
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err.message);
    process.exit(1);
  }
}

start();
