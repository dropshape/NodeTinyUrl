define(function (require) {
    'use strict';

    function Directive(service) {
        return {
            replace: true,
            template: require('text!./template.html'),
            link: function ($scope, $element) {

                $scope.text = {
                    error:null
                };

                //Handle Enter keypress
                $element.bind('keydown keypress', function(event) {
                    if(event.which === 13) {
                        $scope.$apply(function(){
                            $scope.shareUrl();
                        });
                        event.preventDefault();
                    }
                });

                $scope.shortenUrl = function () {
                    console.log('element', $element);
                    service.shortenUrl($scope.shortUrl)
                        .success(function (data) {
                            console.log('success', data);
                        })
                        .error(function () {
                            handleUrlError();
                        });
                };

                //-------------------------------------------------------------------------
                //
                // Private Methods
                //
                //-------------------------------------------------------------------------

                function handleUrlError() {
                    $scope.text.error = 'Invalid URL Please enter a valid URL';
                }
            }
        };
    }

    Directive.$inject = ['tinyUrlService'];
    return Directive;
});


