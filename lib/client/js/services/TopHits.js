define(function () {
    'use strict';

    function Service($http){

        this.topLinks = function(){
            return $http.get('/toplinks/10');
        };
    }
    Service.$inject = ['$http'];
    return Service;
});


