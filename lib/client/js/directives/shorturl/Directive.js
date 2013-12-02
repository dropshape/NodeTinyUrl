define(function (require) {
    'use strict';

    function Directive($sce, service) {
        return {
            replace: true,
            template: require('text!./template.html'),
            link: function ($scope, $element) {

                $scope.text = {
                    error:null,
                    shortUrl:null
                };

                //Handle Enter keypress
                $element.bind('keydown keypress', function(event) {
                    if(event.which === 13) {
                        $scope.$apply(function(){
                            $scope.shortenUrl();
                        });
                        event.preventDefault();
                    }
                });

                $scope.shortenUrl = function () {
                    resetText();
                    service.shortenUrl($scope.shortUrl)
                        .success(function (response) {
                            console.log('success', response.data);
                            $scope.text.shortUrl = $sce.trustAsHtml('<a href="' + response.data.url + '">' + response.data.url + '</a>');
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

                function resetText() {
                    $scope.text.error = null;
                    $scope.text.shortUrl = null;
                }
            }
        };
    }

    Directive.$inject = ['$sce','tinyUrlService'];
    return Directive;
});


