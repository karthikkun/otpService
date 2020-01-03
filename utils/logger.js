const moment = require("moment");

exports.logger = function(logLevel, statusCode, requestId, message){
    console.log({
        "timestamp": moment().format(),
        "level": logLevel,
        "requestId": requestId,
        "message": {"status code": statusCode, "message": message}
     })
}