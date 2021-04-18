module.exports = {
    signUser: (req, res, next) => {
        if (req.user) {
            res.locals.logined = true
            res.locals.user = req.user
            next()
        } else
        next()
    },
    authen: (req, res, next) => {
        if (req.user) {
            next()
        } else {
            res.redirect("/")
        }
    }
}