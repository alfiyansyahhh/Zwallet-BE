const { Sequelize, DataTypes} = require("sequelize");
const db = require('../config/db')

const Users = db.define(
    "users",
    {
        name: {
            type: DataTypes.STRING,

        },
        email: {
            type: DataTypes.STRING,
              
        },
        password: {
            type: DataTypes.STRING,

        },
        pin: {
            type: DataTypes.STRING,

        },
        phone_number: {
            type: DataTypes.NUMBER,

        },
        image: {
            type: DataTypes.STRING,

        },
        saldoUser: {
            type: DataTypes.NUMBER,

        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
)

module.exports = Users;