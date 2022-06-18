const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Handle Registration
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    
    let errors = [];

    // Check if all fields are present
    if(!name || !email ||!password || !password2) {
        errors.push({ msg: 'Please fill all the required information' });
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'The passwords do not match' });
    }

    // Check password length
    if(password.length < 6) {
        errors.push({ msg: 'The password should at least be 6 characters long' });
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email, 
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                // User already exists
                if(user) {
                    errors.push({ msg: 'The email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email, 
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name, 
                        email,
                        password
                    })

                    // Encrypt password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;

                            // Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Successfully Registered! Please login to continue.');
                                    res.redirect('./login');
                                })
                                .catch(err => console.log(err)); 
                        })
                    })
                }
            })
    }
})

// Login Handling
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard', 
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// Logout Handling
router.get('/logout', (req, res) => {
    req.logout;
    req.flash('success_msg', 'Successfully logged out!');
    res.redirect('/users/login');
})

module.exports = router;