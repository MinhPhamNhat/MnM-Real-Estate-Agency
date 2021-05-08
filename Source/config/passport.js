const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Account = require('../repository/AccountRes')
const User = require('../repository/UserRes')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use('local-login',new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
},async(req, username, password, done) => {
    if (username && password) {
        var check = await Account.checkAccount(username, password)
        if (check.code === 0) {
            var profile = await User.findUserById(check.data)
            done(null, profile.data)
        } else {
            done(null, false, { message: check.message })
        }
    } else {
        done(null, false, { message: "Vui lòng nhập username và password" })
    }
}));