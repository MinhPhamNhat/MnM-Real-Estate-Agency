const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Account = require('../repository/account')
const User = require('../repository/user')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async(req, username, password, done) => {
    if (username && password) {
        var check = await Account.checkAccount(username, password)
        var data = JSON.parse(check)
        if (data.code === 0) {
            var profile = await User.findUserById(data.data)
            profile = JSON.parse(profile)
            done(null, profile.data)
        } else {
            done(null, false, { message: data.message })
        }
    } else {
        done(null, false, { message: "Please enter username or password" })
    }
}));