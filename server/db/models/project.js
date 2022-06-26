const { DataTypes } = require('sequelize')
const sequelize = require('../connection')

const Project = sequelize.define('Project', {
    PoolAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    Description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    Website: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Whitepaper: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Twitter: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Telegram: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Medium: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Github: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    StakeAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    TokenAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    OwnerAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    LogoUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    BeginTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    EndTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    MoneyRaise: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ChainId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    tableName: 'project',
    timestamps: false,
})

module.exports = Project