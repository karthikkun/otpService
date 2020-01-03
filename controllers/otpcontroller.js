const request = require('request');
const Config = require('../config');
const redis = require('redis')
const crypto = require('crypto')
const moment = require('moment');
const bodyParser = require('body-parser');
const utils = require('../utils/logger')

function generateHash(username,phoneNumber) {
    timestamp = moment().valueOf();
    let data = username + phoneNumber + timestamp
    const generated_hash = crypto.createHash('sha256').update(data, 'utf-8').digest('hex')
    console.log(generated_hash)
    console.log('done')
    return generated_hash;
}

function redisPersist(otp,hash){
    const redis = require('redis')
    const client = redis.createClient(Config.reddiscfg.port)

    client.on('connect', function() {
        utils.logger("INFO", 200, hash, "Redis connected")
    });

    client.on('error', (err) => {
        utils.logger("ERROR", error.statusCode, hash,  "Redis connection ERROR: " + error)
    });

    // Expiry time 300 sec
    client.setex( hash, 300, otp);

    client.get(hash, function (error, result) {
        if (error) {
            utils.logger("ERROR", error.statusCode, hash,  "Redis data entry ERROR: " + error)
        }
        // console.log('GET result ->' + result);
    });
}

function sendToKafkaProducer(otp, generated_hash, phoneNumber){
    messages = {
        value: otp.toString(),
        headers: {
            'phoneNumber': phoneNumber.toString(),
            'uid': generated_hash
        }
    }
    topic = 'sapebank-otp'


    request.post(Config.producercfg.url, {
        json: {
            data: messages,
            topicKafka: topic
        }
        }, (error, res, body) => {
        if (error) {
            utils.logger("ERROR", error.statusCode, generated_hash,  "Error post request to Kafka Producer : "+ error)
            return
        }
        console.log(`statusCode: ${res.statusCode}`)
    })
}

exports.sendOTP = async function (req, res) {
    const phoneNumber = req.body.phoneNumber
    const username = req.body.userId

    if (phoneNumber === undefined || username === undefined) {
        // console.log('please pass valid mobile No and message');
        res.status(400);
        return res.json({ status: 'failure', message: 'please pass valid phone number and username' });
    }
    else if(phoneNumber === null || phoneNumber === "" || username === "" || username === null){
        res.status(400);
        return res.json({ status: 'failure', message: 'please pass valid phone number and username' });
    }
    else{
        let otp = await Math.floor(Math.random()*900000 + 100000); // To generate random OTP 
        let generated_hash = await generateHash(username,phoneNumber);
        await redisPersist(otp,generated_hash); //make call to persist otp in redis cache with expiry of 5 min 
        await sendToKafkaProducer(otp,generated_hash, phoneNumber); //make a call to kafka producer with structured message payload
        utils.logger("INFO", 200, generated_hash, "Sent to Kafka Producer OTP:" + otp)
        res.status(200);
        return res.json({ status: 'pass', message: 'Sent to Kafka Producer', uniqueHash : generated_hash});
    }
};

exports.validateOTP = function (req, res) {
    const otp = req.body.otp
    const uid = req.body.uid
    console.log(otp, uid)
    const redis = require('redis')
    const redisClient = redis.createClient(Config.reddiscfg.port)

    redisClient.on('connect', function() {
        utils.logger("INFO", 200, uid, "Redis connected")
    });

    redisClient.on('error', (err) => {
        utils.logger("ERROR", error.statusCode, uid,  "Redis connection ERROR: " + error)
    });

    console.log("Validation Started")
    
    // console.log(otp, uid)
    if (uid === undefined || otp === undefined) {
        utils.logger("ERROR", 400, uid, "invalid otp passed")
        res.status(400);
        return res.json({ status: 'failure', message: 'please pass valid uid and otp' });
    }
    else{
        redisClient.get(uid, function (error, otpFromCache) {
            if (error) {
                utils.logger("ERROR", error.statusCode, uid, error)
                throw error;
            }
            else{
                if(otp == otpFromCache){
                    utils.logger("INFO", 200, uid, otp + " OTP TRUE")
                    res.status(200);
                    return res.json({ status: 'success', message: 'OTP TRUE' })
                }
                else{
                    utils.logger("INFO", 200, uid, otp + " OTP FALSE")
                    res.status(200);
                    return res.json({ status: 'success', message: 'OTP FALSE' });
                }
            }
        });
    }
}