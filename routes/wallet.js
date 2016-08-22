var router = require('koa-router')();

var config = require('../config');
var pending = require('../test-data/pending.json');
var settled = require('../test-data/settled.json');
var unauthorized = require('../test-data/unauthorized.json');

router.get('/balances', function *(next) {
  if(this.headers['authorization'] === config.bearerToken){
    this.status = config.okResponse;
    this.body = settled;
  }
  else {
    this.status = config.unauthorized;
    this.body = unauthorized;
  }
});

router.get('/balance/pending', function *(next) {
  if(this.headers['authorization'] === config.bearerToken){
    this.status = config.okResponse;
    this.body = pending;
  }
  else {
    this.status = config.unauthorized;
    this.body = unauthorized;
  }
});

module.exports = router;
