var Promise = require('bluebird');
var redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var client;
var _ = require("lodash");
const appConstants = require("../constants");
const config = require("../config");

var init = function () {
    client = redis.createClient(config.cfg.redis.port, config.cfg.redis.server)
    return client.onAsync("error")
        .then(function (err) {
            console.log('error: ', err);
        })
};

exports.setValue = function (key, value) {
    return client.setAsync(key, value)
        .then(function (resp) {
            if (resp) {
                console.log("value: ", resp, "_redisSetValue");
                return resp;
            }
        })
    .catch(function(err) {
            return err;
        })
};

exports.getValue = function (key) {
    return client.getAsync(key)
        .then(function (res) {
            return res;
        })
    .catch(function(err) {
            return err;
        })
    //client.get(key, function (err, res) {
    //    if (err) {
    //        console.ERROR({"error": err}, "redis getValue");
    //        callback(null);
    //    } else {
    //        callback(res);
    //    }
    //});
};

exports.expire = function (key, expiryTime) {
    return client.expireAsync(key, expiryTime)
    .then(function(resp) {
            console.log('expire: ', resp, "_expireToken")
            return resp;
        })
    .catch(function(err) {
            console.log("error", err, "_expireToken")
        })
};

exports.delValue = function (key) {
    return client.delAsync(key)
        .then(function (resp) {
            console.log("key " + key + " deleted. response is " + resp);
            return resp;
        })
        .catch(function (err) {
            throw err;
        })
}

init();
