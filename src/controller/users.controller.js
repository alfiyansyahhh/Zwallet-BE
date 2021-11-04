const usersModels = require("../models/users.model");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { success, failed } = require("../helpers/response");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../helpers/env");
const tr = require("../models/transaction.model");
const { rawAttributes } = require("../models/users.model");
const Op = Sequelize.Op;

const users = {
  getAll: async (req, res) => {
    try {
      const { query } = req;
      const search = query.search === undefined ? "" : query.search;
      const field = query.field === undefined ? "id" : query.field;
      const typeSort = query.sort === undefined ? "DESC" : query.sort;
      const limit = query.limit === undefined ? 100 : parseInt(query.limit);
      const page = query.page === undefined ? 1 : query.page;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      const all = await usersModels.findAll({
        where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
      })

      const result = await usersModels.findAll({
        where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
            offset,
            limit,
            field,
            typeSort,
          })
          const response = {
            result,
            totalPage: Math.ceil(all.length/limit),
            limit,
            page,
          }
        success(res, response, 'Get All Users Success');
    } catch (error) {
      failed(res, 404, error);
    }
  },


  getDetail: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await usersModels.findAll({
        where: {
          id,
        },
      });
      success(res, result, "Get Details Users Success");
    } catch (error) {
      failed(res, 404, error);
    }
  },
  
  login: async (req, res) => {
    try {
      const { body } = req;
      const email = req.body.email;
      const cekEmail = await usersModels.findAll({
        where: {
          email,
        },
      });
      if (cekEmail.length <= 0) {
        failed(res.status(404), 404, "Email not Exist");
      } else {
        const passwordHash = cekEmail[0].password;
        bcrypt.compare(body.password, passwordHash, (error, checkpassword) => {
          if (error) {
            res.json(error);
          } else if (checkpassword === true) {
            const user = cekEmail[0];
            const payload = {
              id: user.id,
            };
            const output = {
              user,
              token: jwt.sign(payload, JWT_SECRET),
            };
            success(res, output, "Login Success");
          } else {
            failed(res.status(404), 404, "Wrong Password");
          }
        });
      }
    } catch (error) {
      failed(res, 500, error);
    }
  },
 
  loginPin: async (req, res) => {
    try {
      const { body } = req;
      const id = req.userId;
      const Pin = await usersModels.findAll({
          where: {
              id,
          },
      });
        const pinHash = Pin[0].pin;
        bcrypt.compare(body.pin, pinHash, (error, checkpassword) => {
          if (error) {
            res.json(error);
          } else if (checkpassword === true) {
            success(res, "pin Success");
          } else {
            failed(res.status(404), 404, "Wrong Password");
          }
        });
      
    } catch (error) {
      failed(res, 500, error);
    }
  },
  register: async (req, res) => {
    try {
      const { body } = req;
      const hash = bcrypt.hashSync(body.password, 10);
      const email = req.body.email;
      const cekEmail = await usersModels.findAll({
        where: {
          email,
        },
      });
      if (cekEmail.length <= 0) {
        const result = await usersModels.create({
          name: body.name,
          email: body.email,
          password: hash,
          phone_number: body.phone_number,
          image: "default.png",
          saldoUser: 0, 
        });
        const payload = {
          id: result.id,
        };
        const output = {
          user: result,
          token: jwt.sign(payload, JWT_SECRET),
        };
        success(res, output, "Register Success");
      } else {
        failed(res.status(401), 401, "Email already exist");
      }
    } catch (error) {
      failed(res, 500, error);
    }
  },
  insertPin: async (req, res) => {
    try {
      const { pin } = req.body
      const hash = bcrypt.hashSync(pin, 10);
      const id = req.userId;
      const result = await usersModels.update(
        {
          pin: hash
        },
        {
          where: {
            id,
          },
        });
        success(res, result, "set pin succes");
    } catch (error) {
      failed(res, 500, error);
    }
  },
  update: async (req, res) => {
    try {
      const {
        name,
        email,
        phone_number,
      } = req.body;
      
      const id = req.userId;
      const Detail = await usersModels.findAll({
        where: {
          id,
        },
      });
      const result = await usersModels.update(
        {
          name,
          email,
          phone_number,
          image: req.file ? req.file.filename : "default.png",
        },
        {
          where: {
            id,
          },
        });
      if (Detail[0].image === "default.png") {
        success(res, result, "Update Data Success");
      } else {
        fs.unlink(`./image/uploads/${Detail[0].image}`, (err) => {
          if (err) {
            failed(res.status(500), 500, err);
          } else {
            success(res, result, "Update Data Success");
          }
        });
      }
    } catch (error) {
      failed(res, 500, error);
    }
  },


};

module.exports = users;
