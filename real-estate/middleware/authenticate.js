module.exports = {
    authen: (req, res, next) => {
        if (req.user) {
            res.locals.logined = true
            res.locals.user = req.user
            next()
        } else {
            next()
        }
    }
}