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
            res.status(404).redirect("404")
        }
    },

    adminAuthen: (req, res, next) =>{
        if (req.user.role.admin){
            next()
        }else{
            res.status(404).render('404')
        }
    }
}