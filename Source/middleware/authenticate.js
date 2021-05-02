const Statistic = require('../repository/StatisticRes')
module.exports = {
    signUser: async (req, res, next) => {
        if (req.user) {
            res.locals.numOfNoti = await Statistic.getNumOfInform({ownerId: req.user.accountId, isRead: false})
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
    },

    adminAuthen: (req, res, next) =>{
        if (req.user.role){
            next()
        }else{
            res.render('404')
        }
    }
}