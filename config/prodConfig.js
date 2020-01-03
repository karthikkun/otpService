var servercfg = {
    host: 'localhost',
    port: '8020'
};
var loggercfg = {
    url : 'http://localhost:3000/api/logger/',
    origin : 'addBankService'
};


var producercfg = {
    url: 'http://localhost:8052/api/producer'
}

var reddiscfg = {
    port: '6379',
}
module.exports = {
    'serverPort': '8051',
    producercfg,
    reddiscfg,
    servercfg,
    loggercfg
};
