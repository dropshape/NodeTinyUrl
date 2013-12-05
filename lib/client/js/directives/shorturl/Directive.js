define(function (require) {
    'use strict';

    function Directive($sce, service) {
        return {
            replace: true,
            template: require('text!./template.html'),
            scope:{},
            link: function ($scope, $element) {

                $scope.text = {
                    error: null,
                    shortUrl: null
                };
                $scope.shortenedUrl = null;

                //Handle Enter keypress
                $element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        $scope.$apply(function () {
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
                            $scope.shortenedUrl = response.data.url;
                            $scope.text.shortUrl = $sce.trustAsHtml(
                                '<a class="alert-link" href="' + $scope.shortenedUrl + '">' + $scope.shortenedUrl + '</a>'
                            );
                        })
                        .error(function () {
                            handleUrlError();
                        });
                };

                $scope.shareUrl = function () {
                    service.shareUrl($scope.shortenedUrl);
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

    Directive.$inject = ['$sce', 'tinyUrlService'];
    return Directive;
});


