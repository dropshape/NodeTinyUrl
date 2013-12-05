define(function () {
    'use strict';

    function Service($http, $window){

        this.shortenUrl = function(url){
            return $http.post('/', {url:url});
        };

        this.shareUrl = function(url){
            return $http.get('/twitter/share',
                {
                    params:{
                        link:url,
                        ta:2172725304,
                        text:'Check out this post '
                    }
                }).success(function(data){
                    $window.location = data.data.redirect;
                });
        };
    }
    Service.$inject = ['$http', '$window'];
    return Service;
});


