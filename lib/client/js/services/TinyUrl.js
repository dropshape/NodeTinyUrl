define(function () {
    'use strict';

    function Service($http){

        this.shortenUrl = function(url){
            return $http.post('/', {url:url});
        };
    }
    Service.$inject = ['$http'];
    return Service;
});


