const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const registerRouter = require('./controllers/register');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const indexRouter = require('./controllers/index');

const authenticate = require('./middleware/authenticate');
const app = express();

require('./config/passport')
require("./config/database")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session ({
    secret:'Meow meow',
    saveUninitialized: true,
    resave: true
}));
app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter)
app.use('/',authenticate.authen, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});


app.listen(8080, ()=>console.log("http://localhost:8080"))

module.exports = app;
