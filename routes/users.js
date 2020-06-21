const express = require("express");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

const router = express.Router();

// Register Page
router.get("/register", forwardAuthenticated, (req, res) => {
	res.render("register");
});
router.post("/register", (req, res) => {
	let errors = [];
	const { name, email, password, password2 } = req.body;
	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please fill up all the fields!" });
	}
	if (password.length < 6) {
		errors.push({ msg: "Password must have at least 6 characters" });
	}
	if (password !== password2) {
		errors.push({ msg: "Passwords didn't matched" });
	}
	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		// Validation passed!
		const newUser = new User({
			name,
			email,
			password
		});
		// hash password
		bcryptjs.genSalt(10, (err, salt) => {
			bcryptjs.hash(newUser.password, salt, (err, hash) => {
				if (err) {
					throw err;
				}
				// set password to hash
				newUser.password = hash;
				// save the user
				newUser
					.save()
					.then(user => {
						req.flash(
							"success_msg",
							"Registration successfull! Login to your account."
						);
						res.redirect("/users/login");
					})
					.catch(err => console.log(err));
			});
		});
	}
});

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => {
	res.render("login");
});

// Login handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
});

// logout handle
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You have successfully logged out!");
	res.redirect("/users/login");
});

module.exports = router;
