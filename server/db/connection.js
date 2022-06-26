const { Sequelize } = require('sequelize')
const { DATABASE_HOST_URI, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST_URI,
    dialect: 'mysql',
});

module.exports = sequelize
