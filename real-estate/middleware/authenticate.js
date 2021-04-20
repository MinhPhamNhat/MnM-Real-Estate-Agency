const Statistic = require('../repository/StatisticRes')
module.exports = {
    signUser: async (req, res, next) => {
        if (req.user) {
            res.locals.numOfNoti = await Statistic.getNumOfContact({propertyOwner: req.user.accountId, isRead: false})
            res.locals.logined = true
            res.locals.user = req.user
        }
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