define(function () {
    'use strict';

    function Controller($scope, service){

        service.topLinks().success(function(data){
            $scope.topLinks = data.data;
        });
    }

    Controller.$inject = ['$scope', 'topHitsService'];
    return Controller;
});


