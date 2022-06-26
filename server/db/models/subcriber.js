const { DataTypes } = require('sequelize')
const sequelize = require('../connection')

const Subscriber = sequelize.define('subscriber', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    email: DataTypes.STRING(100),

}, {
    tableName: 'subscriber',
    timestamps: false,
})

module.exports = Subscriber
