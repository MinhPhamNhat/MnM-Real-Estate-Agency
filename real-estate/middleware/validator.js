const { check } = require("express-validator")

module.exports = {
    loginValidator: (req, res, next) => {
        return [
            check("username").not().isEmpty().withMessage("Vui lòng nhập tên đăng nhập"),
            check("username").isLength({min: 6, max: 18}).withMessage("Tên đăng nhập phải lớn hơn 6 và nhỏ hơn 18 ký tự"),
            check("username").not().matches("[^A-Za-z0-9]").withMessage("Tên đăng nhập không được chứa ký tự đặc biệt"),

            check("password").not().isEmpty().withMessage("Vui lòng nhập mật khẩu"),
        ]
    },
    
    registerValidator: (req, res, next) => {
        return[
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên"),
            check("name").not().isAlpha().withMessage("Tên không được chứa số hoặc ký tự đặc biệt"),

            check("email").not().isEmpty().withMessage("Vui lòng nhập email"),
            check("email").isEmail().withMessage("Email không hợp lệ"),

            check("username").not().isEmpty().withMessage("Vui lòng nhập tên đăng nhập"),
            check("username").isLength({min: 6, max: 18}).withMessage("Tên đăng nhập phải lớn hơn 6 và nhỏ hơn 18 ký tự"),
            check("username").not().matches("[^A-Za-z0-9]").withMessage("Tên đăng nhập không được chứa ký tự đặc biệt"),

            check("password").not().isEmpty().withMessage("Vui lòng nhập mật khẩu"),
            check("password").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("password").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),

            check("confirm-password").not().isEmpty().withMessage("Vui lòng nhập lại mật khẩu"),
            check("confirm-password").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("confirm-password").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            check("confirm-password").custom( (value, {req}) => {
                return value===req.body.password
              }).withMessage("Mật khẩu nhập lại không khớp"),

        ]
    },

}