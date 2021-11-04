const { Sequelize, DataTypes} = require("sequelize");
const db = require('../config/db')

const Transaction = db.define(
    "transaction",
    {
        total: {
            type: DataTypes.NUMBER,

        },
        from: {
            type: DataTypes.NUMBER,
        },
        to: {
            type: DataTypes.NUMBER,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
)

module.exports = Transaction;