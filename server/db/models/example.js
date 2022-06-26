/* How to make a model */
/*

const { DataTypes } = require('sequelize')
const sequelize = require('../connection')

const Example = sequelize.define('Example', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING(45),

}, {
    tableName: 'example_table_in_database',
    timestamps: false,
})

module.exports = Example

*/