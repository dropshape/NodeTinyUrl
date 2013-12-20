define(function () {
    'use strict';

    function Service($http, $window, endpoint, via, shareText){

        this.shortenUrl = function(url){
            return $http.post('/', {url:url});
        };

        this.shareUrl = function(url){
            return $http.get(endpoint,
                {
                    params:{
                        link:url,
                        via:via,
                        text:shareText
                    }
                }).success(function(data){
                    $window.location = data.data.redirect;
                });
        };
    }
    Service.$inject = ['$http', '$window', 'shareEndpoint', 'via', 'shareText'];
    return Service;
});


