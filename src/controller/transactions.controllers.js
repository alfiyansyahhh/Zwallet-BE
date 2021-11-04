const transactionModels = require("../models/transaction.model");
const usersModels = require("../models/users.model");
const { Sequelize } = require("sequelize");
const { success, failed } = require("../helpers/response");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../helpers/env");
const Op = Sequelize.Op;

const Transactions = {
  getTransactionsDetails: async (req, res) => {
    try {
    const id = req.params.id;
    const result = await transactionModels.findAll({
        where: { id },
    })
        success(res, result, 'Get detailsTransaction Success');
    } catch (error) {
      failed(res, 404, error);
    }
  },

  topUp: async (req,res) => {
    try {
      const { total } = req.body;
      const id = req.userId;

      const result = await transactionModels.create({
            total, 
            user: id, 
            from: id, 
            to: id
      });

      const saldoUser = await usersModels.findAll({
        where: { id },
      })
      const saldo = saldoUser[0].saldoUser 

      const updateSaldo = await usersModels.update(
        {
          saldoUser: saldo + Number(total)
        },
        {
          where: {
            id,
          },
        }
      )
      success(res, result, "top up Success");
    } catch (error) {
       failed(res, 404, error);
    }
  },

  transfer: async (req,res) => {
    try {
      const { total, to } = req.body;
      const id = req.userId;

      const saldoSender = await usersModels.findAll({
        where: { id },
      })
      const saldoReceiver = await usersModels.findAll({
        where: { id:to },
      })
     
      const sender = saldoSender[0].saldoUser 
      const receiver = saldoReceiver[0].saldoUser 
      
      if (total > sender) {
        failed(res, 404, error);
      } else {
        const updateSaldoSender = await usersModels.update(
          {
            saldoUser: sender - Number(total)
          },
          {
            where: {
              id,
            },
          }
        )
  
        const updateSaldoReceiver = await usersModels.update(
          {
            saldoUser: receiver + Number(total)
          },
          {
            where: {
              id:to,
            },
          }
        )
  
        const insertTransaction = await transactionModels.create({
          total, user:id, from:id, to
        });
  
        const result = {
          updateSaldoSender,updateSaldoReceiver,insertTransaction
        }
   
        success(res, result, "transaction succes");
      }

     
    } catch (error) {
      failed(res, 404, error);
    }
  },
  getTransactionsUser: async(req, res) =>{
    try {
      const { query } = req;
        const id = req.userId;
        const field = query.field === undefined ? 'id' : query.field;
        const typeSort = query.sort === undefined ? 'DESC' : query.sort;
        const limit = query.limit === undefined ? 5 : parseInt(query.limit);
        const page = query.page === undefined ? 1 : query.page;
        const offset = page === 1 ? 0 : (page - 1) * limit;

        transactionModels.belongsTo(usersModels, {
          foreignKey: 'to'
        })
        const All = await transactionModels.findAll({
            where: {
                [Op.or]:[{from:id},{to:id}]
            },
            include: [
                {model: usersModels, attributes:["id","name","image"]}
            ]
        });
        const result = await transactionModels.findAll({
            where: {
                [Op.or]:[{from:id},{to:id}]
            },
            offset,
            limit,
            order : [[field, typeSort]],
            include: [
                {model: usersModels,  attributes:["id","name","image"]}
            ]
        });
        const response = {
          result,
          totalPage: Math.ceil(All.length/limit),
          limit,
          page,
        }
        success(res, response, "get all transaction success");
    } catch (error) {
        console.log(error)
        failed(res.status(401), 401, error);
    }
},
  
  insert : async (req,res) => {
      try {
        const { total, user, from, to } = req.body;
        const result = await transactionModels.create({
              total, user, from, to
          });
          success(res, result, "transaction succes");
      } catch (error) {
        failed(res, 500, error);
      }
  },
};

module.exports = Transactions;
