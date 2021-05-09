const AccountRes = require("../repository/AccountRes")
const Account = require("../models/AccoutnSchema")
const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app')

chai.use(chaiHttp)

describe('* TEST REGISTER ', () => {
    describe('- /POST/register ', () => {
        it('Thông tin hợp lệ phải trả về status 200', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana@gmail.com",
                username: "nguyenvana2000",
                password: "123456",
                "confirm-password": "123456",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 200);
                        done();
                    });
        })

        it('Thiếu thông tin phải trả về status 422', (done) => {
            var payload = {
                email: "nguyenvana@gmail.com",
                username: "phamnhatminh2000"
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        done();
                    });
        })

        it('Email đã tồn tại phải trả về status 409', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana@gmail.com",
                username: "nguyenvana2001",
                password: "123456",
                "confirm-password": "123456",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 409);
                        done();
                    });
        })

        it('Tên tài khoản đã tồn tại phải trả về status 409', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana2@gmail.com",
                username: "nguyenvana2000",
                password: "123456",
                "confirm-password": "123456",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 409);
                        done();
                    });
        })
        

        it('Tên không hợp lệ trả về 422', (done) => {
            var payload = {
                name: "Nguyen Van A$####24",
                email: "nguyenvana2@gmail.com",
                username: "nguyenvana2000",
                password: "123456",
                "confirm-password": "123456",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        done();
                    });
        })

        it('Email không hợp lệ trả về 422', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana2",
                username: "nguyenvana2000",
                password: "123456",
                "confirm-password": "123456",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        done();
                    });
        })
        
        it('Tên tài khoản không hợp lệ trả về 422', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana2@gmail.com",
                username: "nguyenvana2001./?ơ]",
                password: "123456",
                "confirm-password": "123456",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        done();
                    });
        })

    
        it('Mật khẩu không hợp lệ trả về 422', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana2@gmail.com",
                username: "nguyenvana2001",
                password: "1",
                "confirm-password": "1",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        done();
                    });
        })

    
        it('Mật khẩu nhập lại không chính xác trả về 422', (done) => {
            var payload = {
                name: "Nguyen Van A",
                email: "nguyenvana2@gmail.com",
                username: "nguyenvana2001",
                password: "123456",
                "confirm-password": "1234567",
            }
            chai.request(server)
                    .post('/register')
                    .send(payload)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        done();
                    });
        })
    });
})
