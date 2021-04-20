const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const cors = require('cors')

const registerRouter = require('./controllers/register');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const indexRouter = require('./controllers/index');
const propertyRouter = require('./controllers/property');
const locationRouter = require('./controllers/location');
const profileRouter = require('./controllers/profile');
const contactRouter = require('./controllers/contact')
const authenticate = require('./middleware/authenticate');
const app = express();

require('dotenv').config()
require('./config/passport')
require("./config/database")
require("./config/firebase")

const HOST = process.env.HOST
const PORT = 8080||process.env.PORT
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
app.use(cors())

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter)
app.use('/',authenticate.signUser, indexRouter);
app.use('/property',authenticate.signUser, propertyRouter);
app.use('/location',authenticate.signUser, locationRouter);
app.use('/profile',authenticate.signUser, profileRouter);
app.use('/contact', contactRouter)

app.locals.getFlooredFixed = (v, d) => {
  return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
}
app.locals.formatPhone = (value) =>{
  if (value[1] === "1"){
    return value.slice(0,5) + " " + value.slice(5,8) + " " + value.slice(8,12)
  }else{
    return value.slice(0,4) + " " + value.slice(4,7) + " " + value.slice(7,11)
  }
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('404');
// });


app.listen(PORT, ()=>console.log("http://"+HOST+":"+PORT))

module.exports = app;
