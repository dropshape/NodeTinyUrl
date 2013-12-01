'use strict';

var Q = require('q');
var async = require('async');

module.exports = exports = function BootStrap(container){

    this.start = function start(modules){
        var defer = Q.defer();

        process.nextTick(function(){
            async.eachSeries(modules, function process(item, done){
                item(container);
                done();
            }, function done(err, results){
                process.nextTick(function(){
                    defer.resolve(err, results);
                });
            });
        });
        return defer.promise;
    };
};