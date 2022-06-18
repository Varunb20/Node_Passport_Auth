const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'The email is not registered' });
                    }

                    // Match Passwords
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Email/Password is incorrect' });
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    );

    // Serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    });

    // Deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}