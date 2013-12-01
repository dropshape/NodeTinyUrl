'use strict';

var Logger = require('./Logger');
var express = require('express');
var bunyan = require('bunyan');
var config = require('../config/config');
var Mongoose = require('mongoose').Mongoose;

function Module(container) {
    return container.module('dependenciesModule', [])
        .value('config', config)
        .value('bunyan', bunyan)
        .service('logger', Logger)
        .service('mongoose', Mongoose)
        .value('express', express)
        .value('apiMessage', require('node-api-message'));
}

exports = module.exports = Module;