const PropertyRes = require("../repository/PropertyRes")
const Property = require("../models/PropertySchema")
const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app')
chai.use(chaiHttp)


describe('* TEST PROPERTY ', () => {
    after(async() => {
        await Property.deleteMany({ title: "Test Bán nhà " }).exec()
    })
  describe('- Test Các hàm trong Property Repository', () => {
    describe('getProperty', () => {
      it('getProperty: Bất động sản không tồn tại phải trả về code = -1', async () => {
        await PropertyRes.getProperty({ _id: "608eb4c179de4a53401fd378" })
          .then(data => {
            assert.strictEqual(data.code, -1);
          }).catch(err => {
            assert.strictEqual(false, true)
          })
      });

      it('getProperty: Bất động sản tồn tại phải trả về code = 0', () => {
        return PropertyRes.getProperty({ _id: "608eb4c179de4a53401fd369" })
          .then(data => {
            assert.strictEqual(data.code === 0, true);
          }).catch(err => {
            assert.strictEqual(err, true)
          })
      });

      it('getProperty: Bất động sản tồn tại và có status là true thì phải trả về đúng bất động sản đó', (done) => {
        PropertyRes.getProperty({ _id: "608eb4c179de4a53401fd369", status: true })
          .then(data => {
            assert.strictEqual(data.data.status === true && data.code === 0 && data.data._id.toString() === "608eb4c179de4a53401fd369",
              true);
            done()
          }).catch(err => {
            assert.strictEqual(err, true)
            done()
          })
      });
    })

    var id;
    describe('createProperty', () => {
      it('createProperty: Thiếu thông tin trả về code = -2', async () => {
        var property = {}
        await PropertyRes.createProperty(property)
          .then(data => {
            assert.strictEqual(data.code, -2);
          }).catch(err => {
            assert.strictEqual(err, -2)
          })
      });

      it('createProperty: Giá (price) và Diện tích price bé hơn 0 trả về code = -2', async () => {
        var authorId = "606e9e93c029084ad09e7bf5"
        var property = {
          title: "Test Bán nhà ",
          isSale: true,
          type: "personal-house",
          location: {
            cityId: "TP08",
            districtId: "QH01",
          },
          address: "abc, street",
          price: -1,
          area: -1,
          description: "Test",
          date: new Date(),
          status: false,
          authen: false,
        }
        await PropertyRes.createProperty(property, authorId)
          .then(data => {
            assert.strictEqual(data.code, -2);
          }).catch(err => {
            assert.strictEqual(err, -2)
          })
      });

      it('createProperty: Loại hình(type) không thuộc trường yêu cầu trả về code = -2', async () => {
        var authorId = "606e9e93c029084ad09e7bf5"
        var property = {
          title: "Test Bán nhà ",
          isSale: true,
          type: "assa",
          location: {
            cityId: "TP08",
            districtId: "QH01",
          },
          address: "abc, street",
          price: 100,
          area: 100,
          description: "Test",
          date: new Date(),
          authorId,
          status: false,
          authen: false,
        }
        await PropertyRes.createProperty(property, authorId)
          .then(data => {
            assert.strictEqual(data.code, -2);
          }).catch(err => {
            assert.strictEqual(err, -2)
          })
      })

      it('createProperty: Thông tin hợp lệ trả về code = 0', (done) => {
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
          authorId,
          status: false,
          authen: false,
        }
        PropertyRes.createProperty(property, authorId)
          .then(async data => {
            assert.strictEqual(data.code, 0);
            await PropertyRes.deleteProperty(data.data._id, undefined, true)
            done()
          }).catch(err => {
            assert.strictEqual(err, true)
            done()
          })
      })
    })

    describe('deleteProperty', () => {

      it('deleteProperty: Xóa bất động sản không tồn tại trả về code = -1', (done) => {
        var authorId = "606e9e93c029084ad09e7bf5"
        PropertyRes.deleteProperty("606e9e93c029084ad09e7bf5", authorId, false)
          .then(deleteData => {
            assert.strictEqual(deleteData.code, -1)
            done()
          }).catch(err => {
            assert.strictEqual(err, -1)
            done()
          })
      })

      it('deleteProperty: Xóa bất động sản không thuộc về người đăng bất động sản trả về code = -1', (done) => {
        var authorId = "606e9e93c029084ad09e7bf5"
        PropertyRes.deleteProperty(id, "606e9e93c029084ad09e7bf4", false)
          .then(deleteData => {
            assert.strictEqual(deleteData.code, -1)
            done()
          }).catch(err => {
            assert.strictEqual(err, -1)
            done()
          })
      })

      it('deleteProperty: Xóa thông tin thành công trả về code = 0', async () => {
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
          authorId,
          status: false,
          authen: false,
        }
        var data = await PropertyRes.createProperty(property, authorId)
        PropertyRes.deleteProperty(data.data._id, authorId, false)
          .then(deleteData => {
            assert.strictEqual(deleteData.code, 0)
          }).catch(err => {
            assert.strictEqual(err, 0)
          })
      })

      it('deleteProperty: Xóa bất động sản nếu là admin trả về code = 0', async () => {
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
        PropertyRes.deleteProperty(data.data._id, undefined, true)
          .then(deleteData => {
            assert.strictEqual(deleteData.code, 0)
          }).catch(err => {
            assert.strictEqual(err, 0)
          })
      })
    })

    describe('editProperty', () => {

      it('editProperty: Nếu bất động sản không hợp lệ trả về code = -2', async () => {
        var authorId = "606e9e93cd09e7bf5"
        await PropertyRes.editProperty("606ad09e7bf5", {}, authorId)
          .then(data => {
            assert.strictEqual(data.code, -2)
          }).catch(err => {
            assert.strictEqual(err, -2)
          })
      })

      it('editProperty: Nếu bất động sản không thuộc người đăng trả về -2 ', async () => {
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
          authorId,
          status: false,
          authen: false,
        }
        var data = await PropertyRes.createProperty(property, authorId)
        await PropertyRes.editProperty(data.data._id, {}, "606e9e93c029084ad09e7bf6")
          .then(editData => {
            assert.strictEqual(editData.code, -2)
          }).catch(err => {
            assert.strictEqual(err, -2)
          })
      })

      it('editProperty: Nếu bất động sản không tồn tại và thông tin hợp lệ trả về -1 ', async () => {
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
        await PropertyRes.editProperty("606e9e93c029084ad09e7bf6", property, authorId)
          .then(editData => {
            assert.strictEqual(editData.code, -1)
          }).catch(err => {
            assert.strictEqual(err, -1)
          })
      })

      it('editProperty: Nếu bất động sản tồn tại và thông tin thay đổi hợp lệ trả về 0', async () => {
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
          authorId,
          status: false,
          authen: false,
        }

        var newProperty = {
          title: "Test Bán nhà ",
          isSale: true,
          type: "street-house",
          address: "bcd, street",
          price: 200,
          area: 500,
        }
        var data = await PropertyRes.createProperty(property, authorId)
        await PropertyRes.editProperty(data.data._id, newProperty, authorId)
          .then(editData => {
            assert.strictEqual(editData.code, 0)
          }).catch(err => {
            assert.strictEqual(err, 0)
          })
      })
    })

  });

  describe('- Test các route property', () => {
    describe('GET: /search => Tìm kiếm bất động sản', () => {
      it('Tìm thông tin property bằng json', (done) => {
        chai.request(server)
          .get('/property/search')
          .end((err, res) => {
            chai.expect(res).to.be.json
            done();
          });
      })

      it('Tìm thông tin property bằng form', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            submit: "form"
          })
          .end((err, res) => {
            chai.expect(res).to.be.html
            done();
          });
      })

      it('Tìm thông tin có giá bé hơn 1 tỷ', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            priceFrom: 0,
            priceTo: 1000,
          })
          .end((err, res) => {
            var check = true
            res.body.data.forEach(value => {
              if (value.price > 1000) {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có giá âm nếu trả về size của data = 0 thì đúng', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            priceFrom: -999,
            priceTo: -1,
          })
          .end((err, res) => {
            assert.strictEqual(res.body.data.length, 0)
            done();
          });
      })

      it('Tìm thông tin có loại hình là chung cư với giá lớn hơn 1 tỷ', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            priceFrom: 1000,
            priceTo: 99999,
            type: "appartment"
          })
          .end((err, res) => {
            var check = true
            res.body.data.forEach(value => {
              if (value.price <= 1000 || value.type !== "appartment") {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có cùng một người đăng', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            userId: "606e9e93c029084ad09e7bf5",
          })
          .end((err, res) => {
            var check = true
            res.body.data.forEach(value => {
              if (value.authorId !== "606e9e93c029084ad09e7bf5") {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có giá tăng dần', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            sortPrice: "asc-price"
          })
          .end((err, res) => {
            var check = true
            var min = res.body.data[0].price
            res.body.data.forEach(value => {
              if (value.price < min) {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có giá giảm dần', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            sortPrice: "desc-price"
          })
          .end((err, res) => {
            var check = true
            var max = res.body.data[0].price
            res.body.data.forEach(value => {
              if (value.price > max) {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có diện tích tăng dần', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            sortArea: "asc-area"
          })
          .end((err, res) => {
            var check = true
            var min = res.body.data[0].area
            res.body.data.forEach(value => {
              if (value.area < min) {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có diện tích giảm dần', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            sortArea: "desc-area"
          })
          .end((err, res) => {
            var check = true
            var max = res.body.data[0].area
            res.body.data.forEach(value => {
              if (value.area > max) {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })

      it('Tìm thông tin có keyword là : "Cho thuê"', (done) => {
        chai.request(server)
          .get('/property/search')
          .query({
            keyword: "Cho thuê"
          })
          .end((err, res) => {
            var check = true
            res.body.data.forEach(value => {
              if (!(new RegExp("cho thuê", 'i').test(value.title))) {
                check = false
              }
            })
            assert.strictEqual(check, true)
            done();
          });
      })
    })

    describe('GET: /id => Xem chi tiết bất động sản', () => {
      it("Nếu bất động sản không tồn tại trả về status 404", (done) => {
        chai.request(server)
          .get('/property/ddsfsdf')
          .end((err, res) => {
            assert.strictEqual(res.status, 404)
            done();
          });
      })
    
      it("Nếu bất động sản tồn tại trả về status 200", (done) => {
        chai.request(server)
          .get('/property/609524865a001d2a44ff6124')
          .end((err, res) => {
            assert.strictEqual(res.status, 200)
            done();
          });
      })
    })
  })
});


