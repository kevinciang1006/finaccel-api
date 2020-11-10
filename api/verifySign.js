const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = require("../models").User;
const Role = require("../models").Role;
const Op = db.Sequelize.Op;
const config = require("../config/configRoles");

module.exports = {
  signup(req, res) {
    return User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
      .then((user) => {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        })
          .then((roles) => {
            user.setRoles(roles).then(() => {
              res.status(200).send({
                auth: true,
                user: {
                    name: req.body.name,
                    email: req.body.email,
                },
                message: "User registered successfully!",
                errors: null,
              });
            });
          })
          .catch((err) => {
            res.status(500).send({
              auth: false,
              email: req.body.email,
              message: "Error",
              errors: err,
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          auth: false,
          email: req.body.email,
          message: "Error",
          errors: err,
        });
      });
  },

  signin(req, res) {
    return User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            auth: false,
            email: req.body.email,
            accessToken: null,
            message: "Error",
            errors: "User Not Found.",
          });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            auth: false,
            email: req.body.email,
            accessToken: null,
            message: "Error",
            errors: "Invalid Password!",
          });
        }

        var token =
          "Bearer " +
          jwt.sign(
            {
              id: user.id,
            },
            config.secret,
            {
              expiresIn: 86400, //24h expired
            }
          );

        res.status(200).send({
          auth: true,
          user: {
              name: user.name,
              email: req.body.email,
          },
          accessToken: token,
          message: "Success",
          errors: null,
        });
      })
      .catch((err) => {
        res.status(500).send({
          auth: false,
          email: req.body.email,
          accessToken: null,
          message: "Error",
          errors: err,
        });
      });
  },

  getRole(req, res) {
    return User.findByPk(req.userId)
      .then((user) => {
        user.getRoles().then((roles) => {
          return res.status(200).send({
            roles: roles,
            message: "Success",
            errors: null,
          });
        });
      })
      .catch((err) => {
        res.status(500).send({
          roles: [],
          message: "Error",
          errors: err,
        });
      });
  },
};
