const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app')
const request = require('supertest');
const Property = require('../models/PropertySchema')
const PropertyRes = require('../repository/PropertyRes')
chai.use(chaiHttp)

describe('* TEST ROLE ', () => {
    
    describe('- Người dùng chưa đăng nhập', ()=>{
        
        it("Nếu người dùng chưa đăng nhập người dùng có thể vào trang chủ và trả về status 200", (done) => {
            chai.request(server)
            .get('/')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(200)
                done()
            })
        })

        it("Nếu người dùng chưa đăng nhập người dùng có thể vào trang xem chi tiết và trả về status 200", (done) => {
            chai.request(server)
            .get('/property/609524865a001d2a44ff6124')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(200)
                done()
            })
        })

        it("Nếu người dùng chưa đăng nhập người dùng có thể vào trang cá nhân của người khác", (done) => {
            chai.request(server)
            .get('/profile/606e9e93c029084ad09e7bf5')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(200)
                done()
            })
        })

        it("Nếu người dùng chưa đăng nhập người dùng không thể vào trang đăng tin và trả về status 404", (done) => {
            chai.request(server)
            .get('/property/add-property')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(404)
                done()
            })
        })

        it("Nếu người dùng chưa đăng nhập người dùng không thể vào trang sửa tin và trả về status 404", (done) => {
            chai.request(server)
            .get('/property/edit-property')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(404)
                done()
            })
        })

        it("Nếu người dùng chưa đăng nhập người dùng không thể vào trang kiểm duyệt và trả về status 404", (done) => {
            chai.request(server)
            .get('/censor')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(404)
                done()
            })
        })

        it('Nếu người dùng chưa đăng nhập người dùng không thể vào api inform', (done) => {
            chai.request(server)
                .get('/inform')
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(404);
                    done()
                })
        })

        it("Nếu người dùng chưa đăng nhập người dùng không thể đăng tin và trả về status 404", (done) => {
            chai.request(server)
            .post('/property')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(404)
                done()
            })
        })

        it("Nếu người dùng chưa đăng nhập thì không thể vào trang thông báo /profile/inform", (done) => {
            chai.request(server)
            .get('/profile/inform')
            .end((err, res) => {
                chai.expect(res.statusCode).equal(404)
                done()
            })
        })

    })

    describe('- Người dùng đã đăng nhập ', () => {
        var userCredentials = {
            username: "phamnhatminh2000",
            password: "123456",
        }
        var authenticatedUser = request.agent(server);
        before((done) => {
            authenticatedUser
                .post('/login')
                .send(userCredentials)
                .end((err, response) => {
                    chai.expect(response.statusCode).to.equal(302);
                    chai.expect('Location', '/');
                    done();
                });
        });

        it('Nếu người dùng đã đăng nhập thì truy cập vào trang đăng tin (/property/add-property) sẽ trả về status 200', (done) => {
            authenticatedUser
                .get('/property/add-property')
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(200);
                    done()
                })

        })

        it('Nếu người dùng đã đăng nhập có thể đăng tin và trả về status 302', (done) => {
            authenticatedUser
                .post('/property')
                .send({
                        title: 'Test Bán nhà ',
                        isSale: 'True',
                        city: 'TP27',
                        district: 'QH264',
                        type: 'appartment',
                        area: '123',
                        price: '123',
                        unit: 'm',
                        address: '123',
                        rooms: '',
                        bedrooms: '',
                        bathrooms: '',
                        floors: '',
                        description: '123123'
                      })
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(302);
                    done()
                })
        })

        it('Nếu người dùng đã đăng nhập thì truy cập vào trang sửa tin (/property/edit-property) sẽ trả về status 200', (done) => {
            authenticatedUser
                .get('/property/edit-property/609524865a001d2a44ff6124')
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(200);
                    done()
                })

        })

        it('Nếu người dùng đã đăng nhập vào trang sửa tin của người khác sẽ trả về status 404', (done) => {
            authenticatedUser
                .get('/property/edit-property/608eb66379de4a53401fd36b')
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(404);
                    done()
                })
        })

        it('Nếu người dùng đã đăng nhập có thể xóa tin đăng tin trả về code = 0', async () => {
            var authorId = "606e9e93c029084ad09e7bf5"
            var property = {
              title: "Test Bán nhà ",
              isSale: true,
              type: "personal-house",
              location: {
                cityId: "TP01",
                districtId: "QH02",
              },
              address: "abc, street",
              price: 100,
              area: 100,
              description: "Test",
              date: new Date(),
              status: false,
              authen: false,
            }
            var data = await PropertyRes.createProperty(property, authorId)

            authenticatedUser
                .delete(`/property/${data.data._id}`)
                .end((err, res) => {
                    chai.expect(res.body.code).to.equal(0);
                })
        })

        it('Nếu người dùng đã đăng nhập không thể xóa tin đăng tin của người khác và trả về code = -1', async () => {
            var authorId = "607eb46e9dda804124985abe"
            var property = {
              title: "Test Bán nhà ",
              isSale: true,
              type: "personal-house",
              location: {
                cityId: "TP01",
                districtId: "QH02",
              },
              address: "abc, street",
              price: 100,
              area: 100,
              description: "Test",
              date: new Date(),
              status: false,
              authen: false,
            }
            var data = await PropertyRes.createProperty(property, authorId)

            authenticatedUser
                .delete(`/property/${data.data._id}`)
                .end((err, res) => {
                    chai.expect(res.body.code).to.equal(-1);
                })
        })

        it('Nếu người dùng đã đăng nhập vào trang kiểm duyệt (censor) sẽ trả về status 404', (done) => {
            authenticatedUser
                .get('/censor')
                .end(async (err, res) => {
                    chai.expect(res.statusCode).to.equal(404);
                    done()
                })
        })

        it('Nếu người dùng không phải admin người dùng không thể duyệt bài và trả về status 404',  (done) => {
            authenticatedUser
                .post('/inform/censor')
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(404);
                    done()
                })
        })

    });

    describe('- Người dùng là admin ', () => {
        var adminCredentials = {
            username: "admin",
            password: "admin",
        }
        var authenticatedAdmin = request.agent(server);
        before((done) => {
            authenticatedAdmin
                .post('/login')
                .send(adminCredentials)
                .end((err, response) => {
                    chai.expect(response.statusCode).to.equal(302);
                    chai.expect('Location', '/');
                    done();
                });
        });

        it('Nếu người dùng là admin thì có thể truy cập vào trang kiểm duyệt và trả về status 200', () => {
            authenticatedAdmin
                .get('/censor')
                .end((err, res) => {
                    chai.expect(res.statusCode).to.equal(200);
                })

        })

        it('Nếu người dùng là admin thì có thể kiểm duyệt bài và trả về code = 0',async () => {
            var authorId = "606e9e93c029084ad09e7bf5"
            var property = {
              title: "Test Bán nhà ",
              isSale: true,
              type: "personal-house",
              location: {
                cityId: "TP01",
                districtId: "QH02",
              },
              address: "abc, street",
              price: 100,
              area: 100,
              description: "Test",
              date: new Date(),
              status: false,
              authen: false,
            }
            var data = await PropertyRes.createProperty(property, authorId)
            authenticatedAdmin
                .post('/inform/censor')
                .send({
                    propertyOwner: authorId,
                    propertyId: data.data._id,
                    reason: 'Không hợp lệ',
                    isApproved: false
                })
                .end(async (err, res) => {
                    chai.expect(res.body.code).to.equal(0);
                    await Property.deleteMany({ title: "Test Bán nhà " }).exec()
                })
        })
        
        it('Nếu người dùng là admin thì có thể xóa mọi bài đăng và trả về code = 0',async () => {
            var authorId = "606e9e93c029084ad09e7bf5"
            var property = {
              title: "Test Bán nhà ",
              isSale: true,
              type: "personal-house",
              location: {
                cityId: "TP01",
                districtId: "QH02",
              },
              address: "abc, street",
              price: 100,
              area: 100,
              description: "Test",
              date: new Date(),
              status: false,
              authen: false,
            }
            var data = await PropertyRes.createProperty(property, authorId)
            authenticatedAdmin
                .delete(`/property/${data.data._id}`)
                .end(async (err, res) => {
                    chai.expect(res.body.code).to.equal(0);
                    await Property.deleteMany({ title: "Test Bán nhà " }).exec()
                })
        })
    });
})
