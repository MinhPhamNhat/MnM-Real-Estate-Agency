const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app')
const User = require('../models/UserSchema')
const Account = require('../models/AccoutnSchema')
chai.use(chaiHttp)
describe('* TEST LOGIN ', () => {
    after(async ()=>{
        await User.findOneAndRemove({username: "nguyenvana2000"}).exec()
        await Account.findOneAndRemove({username: "nguyenvana2000"}).exec()
    })
    describe('- /POST/login ', () => {
        it('Đăng nhập thành công trả về status 200', (done) => {
            var payload = {
                username: "nguyenvana2000",
                password: "123456",
            }
            chai.request(server)
                .post('/login')
                .send(payload)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    done();
                });
        })

        it('Đăng nhập sai mật khẩu trả về /login', (done) => {
            var payload = {
                username: "nguyenvana2000",
                password: "123457",
            }
            chai.request(server)
                .post('/login')
                .send(payload)
                .end((err, res) => {
                    assert.strictEqual(res.redirects[0].includes("/login"), true)
                    done();
                });
        })

        it('Đăng nhập sai tài khoản trả về /login', (done) => {
            var payload = {
                username: "nguyenvana2001",
                password: "123456",
            }
            chai.request(server)
                .post('/login')
                .send(payload)
                .end((err, res) => {
                    assert.strictEqual(res.redirects[0].includes("/login"), true)
                    done();
                });
        })

        it('Tên tài khoản và mật khẩu rỗng trả về /login', (done) => {
            var payload = {
                username: "",
                password: "",
            }
            chai.request(server)
                .post('/login')
                .send(payload)
                .end((err, res) => {
                    assert.strictEqual(res.redirects[0].includes("/login"), true)
                    done();
                });
        })

        it('Tên tài khoản và mật khẩu sai trả về /login', (done) => {
            var payload = {
                username: "ádasdasda",
                password: "sdasdasdasd",
            }
            chai.request(server)
                .post('/login')
                .send(payload)
                .end((err, res) => {
                    assert.strictEqual(res.redirects[0].includes("/login"), true)
                    done();
                });
        })
    });
})
