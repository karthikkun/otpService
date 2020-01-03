var config;

if(process.env.NODE_ENV === 'development'){
    config = require('./config/devConfig.js');
    console.log('running in development mode');
}
else if(process.env.NODE_ENV === 'staging'){
    config = require('./config/stagingConfig.js');
    console.log('running in staging mode');

}
else{
    config = require('./config/prodConfig.js');
    console.log('running in production mode');

}

module.exports = {
  dbConfig: config.dbConfig,
  servercfg: config.servercfg,
  loggercfg: config.loggercfg,
  loanService: config.loanService,
  investConsentService: config.investConsentService,
  reddiscfg: config.reddiscfg,
  producercfg: config.producercfg,
  serverPort: config.serverPort
};