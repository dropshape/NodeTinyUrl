define(function () {
    'use strict';

    function Service($http){

        this.shortenUrl = function(url){
            return $http.post('/', {url:url});
        };

        this.shareUrl = function(url){
            return $http.post('/share',
                {
                    url:url
                });
        };
    }
    Service.$inject = ['$http'];
    return Service;
});


