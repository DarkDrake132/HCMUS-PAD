const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const JoinedHitory = sequelize.define('JoinedHitory', {
    UserAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        primaryKey: true,
    },
    PoolAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        primaryKey: true,
    } 

}, {
    tableName: 'joined_history',
    timestamps: false,
})

module.exports = JoinedHitory
