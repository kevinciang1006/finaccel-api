const jwt = require('jsonwebtoken');
const config = require('../config/configRoles.js');
const User = require('../models').User;

module.exports = {
	verifyToken(req, res, next) {
		let tokenHeader = req.headers['x-access-token'];

		if (tokenHeader.split(' ')[0] !== 'Bearer') {
			return res.status(500).send({
				auth: false,
				message: "Error",
				errors: "Incorrect token format"
			});
		}

		let token = tokenHeader.split(' ')[1];

		if (!token) {
			return res.status(403).send({
				auth: false,
				message: "Error",
				errors: "No token provided"
			});
		}

		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return res.status(500).send({
					auth: false,
					message: "Error",
					errors: err
				});
			}
			req.userId = decoded.id;
			next();
		});
	},

	isDirector(req, res, next) {
		User.findByPk(req.userId)
			.then(user => {
				user.getRoles().then(roles => {
					for (let i = 0; i < roles.length; i++) {
						console.log(roles[i].name);
						if (roles[i].name.toUpperCase() === "DIRECTOR") {
							next();
							return;
						}
					}
					res.status(403).send({
						auth: false,
						message: "Error",
						message: 'Require Director Role',
					});
					return;
				})
			})
	},

	isStaff(req, res, next) {
		User.findByPk(req.userId)
			.then(user => {
				user.getRoles().then(roles => {
					for (let i = 0; i < roles.length; i++) {
						console.log(roles[i].name);
						if (roles[i].name.toUpperCase() === "STAFF") {
							next();
							return;
						}
					}
					res.status(403).send({
						auth: false,
						message: "Error",
						message: 'Require Staff Role',
					});
					return;
				})
			})
	},

	isLead(req, res, next) {
		User.findByPk(req.userId)
			.then(user => {
				user.getRoles().then(roles => {
					for (let i = 0; i < roles.length; i++) {
						console.log(roles[i].name);
						if (roles[i].name.toUpperCase() === "LEAD") {
							next();
							return;
						}
					}
					res.status(403).send({
						auth: false,
						message: "Error",
						message: 'Require Lead Role',
					});
					return;
				})
			})
	},

	isLeadOrStaff(req, res, next) {
		User.findByPk(req.userId)
			.then(user => {
				user.getRoles().then(roles => {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].name.toUpperCase() === "LEAD") {
							next();
							return;
						}
						if (roles[i].name.toUpperCase() === "STAFF") {
							next();
							return;
						}
					}
					res.status(403).send({
						auth: false,
						message: "Error",
						message: 'Require Lead/Staff Role',
					});
					return;
				})
			})
	},
	
	isLeadOrStaffOrDirector(req, res, next) {
		User.findByPk(req.userId)
			.then(user => {
				user.getRoles().then(roles => {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].name.toUpperCase() === "LEAD") {
							next();
							return;
						}
						if (roles[i].name.toUpperCase() === "STAFF") {
							next();
							return;
						}
						if (roles[i].name.toUpperCase() === "DIRECTOR") {
							next();
							return;
						}
					}
					res.status(403).send({
						auth: false,
						message: "Error",
						message: 'Require Lead/Staff Role',
					});
					return;
				})
			})
	}
}