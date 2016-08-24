var router = require('koa-router')();
var config = require('../config');
var views = require('co-views');
var logger = require('koa-logger');
var authorised = require('./authorise')
var koa = require('koa');
var contributor_authorised = require('../test-data/contributor_authorised.json');
var manager_authorised = require('../test-data/manager_authorised.json');
var owner_authorised = require('../test-data/owner_authorised.json');
var app = module.exports = koa();

var expectedTokenRequest = {
  grant_type: 'authorization_code',
  code: config.authCode,
  client_id: config.client_id,
  client_secret: config.client_secret
}


var render = views(__dirname + '/../views', { ext: 'ejs' });



router.get('/authorise', function *(next) {
  this.body= yield render('login', {
    projectContributorCallbackUrl: this.query.redirect_uri + '?code=' + config.contributorAuthCode,
    syndicateManagerCallbackUrl: this.query.redirect_uri + '?code=' + config.managerAuthCode,
    projectOwnerCallbackUrl: this.query.redirect_uri + '?code=' + config.ownerAuthCode,
    failureUrl: this.query.redirect_uri + '?code=' + config.invalidAuthCode
  });
});

router.post('/token',function * (next){
    var body = this.request.body;
    if(
          body.client_id !== expectedTokenRequest.client_id ||
          body.grant_type !== expectedTokenRequest.grant_type ||
          body.client_secret !== expectedTokenRequest.client_secret
    ) {
      console.log('error request didn\'t match expected results.');
      console.log('Actual post body:',body );
      console.log('Expected post body to include:', expectedTokenRequest);
      this.status = 400;
      this.body = {error: 'invalid_request'};
      return;
    }else {
      if( body.code ===  config.contributorAuthCode ){
        this.body = contributor_authorised
      } else if ( body.code === config.managerAuthCode ){
        this.body = manager_authorised
      } else if (body.code === config.ownerAuthCode ) {
        this.body = owner_authorised
      } else if(body.code ===  config.invalidAuthCode){
        this.status = 400;
        this.body = {error: 'unauthorised_client'}
      }
    }
});


module.exports = router;
