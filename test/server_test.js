const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

it('should return string on / GET', function(done) {
  chai.request(server)
    .get('/')
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      done();
    });
});

describe('vid_recs_req', () => {
  it('should return a json object', (done) => {
    chai.request(server)
      .get('/rec_list/vid/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');

        done();
      });
  });
  it('should return a json obejct with an array as its key', (done) => {
    chai.request(server)
      .get('/rec_list/vid/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property(1);
        res.body.should.have.property(1).eql([1,2,3,4]);
        done();
      });
  });
});
describe('query_recs_req', () => {
  it('should return a json obejct with an array as its key', (done) => {
    chai.request(server)
      .get('/rec_list/search/hello')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('hello');
        res.body.should.have.property('hello').eql([1,2,3,4]);
        done();
      });
  });
});
