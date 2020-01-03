var servercfg = {
    host: 'localhost',
    port: '9092'
};

var producercfg = {
    url: 'http://localhost:8052/api/producer'
}

var reddiscfg = {
    port: 6379,
}

var loggercfg = {
    url : 'http://localhost:3000/api/logger/',
    origin : 'addBankService'
};
module.exports = {
    'serverPort': '8051',
    servercfg,
    loggercfg,
    reddiscfg,
    producercfg
};