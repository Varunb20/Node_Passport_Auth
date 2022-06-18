const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { default: mongoose } = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport');

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongoose
mongoose.connect(db, { useNewUrlParser : 'true' })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser middleware (To get the form data)
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware (To show 'Registration successful!' when we redirect to login page after successful registration)
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log("Server started on port " + PORT));
