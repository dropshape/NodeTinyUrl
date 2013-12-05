define(function (require) {
    'use strict';

    function Directive(service){
        return {
            replace:true,
            template:require('text!./template.html'),
            scope:{},
            link:function($scope){
                $scope.shareUrl = function () {
                    service.shareUrl('http://drpsh.com/4EK_lmyHi');
                };
            }
        };
    }

    Directive.$inject = ['tinyUrlService'];
    return Directive;
});


