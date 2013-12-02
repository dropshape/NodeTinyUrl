define(function (require) {
    'use strict';

    function Directive(d3) {

        return {
            template:require('text!./template.html'),
            scope: {
                data: '=',
                label: '@',
                point: '@',
                title: '@'
            },
            link: function ($scope, $element, $attrs) {

                var element = $element[0];
                var margin = parseInt($attrs.margin, 10 ) || 20;
                var barHeight = parseInt($attrs.barHeight, 10) || 20;
                var barPadding = parseInt($attrs.barPadding, 10) || 5;

                var svg = d3.select(element)
                    .append('svg')
                    .style('width', '100%');

                $scope.$watch('data', function () {
                    $scope.render();
                });

                $scope.render = function () {
                    if (!$scope.data) {
                        return;
                    }
                    var data = $scope.data;
                    // remove all previous items before render
                    svg.selectAll('*').remove();

                    // setup variables
                    var width = d3.select(element).node().offsetWidth - margin;
                    // calculate the height
                    var height = $scope.data.length * (barHeight + barPadding);
                    // Use the category20() scale function for multicolor support
                    var color = d3.scale.category20();
                    // our xScale
                    var xScale = d3.scale.linear()
                        .domain([0, d3.max(data, function (d) {
                            return d[$scope.point];
                        })])
                        .range([0, width]);

                    // set the height based on the calculations above
                    svg.attr('height', height);

                    //create the rectangles for the bar chart
                    svg.selectAll('rect')
                        .data(data).enter()
                        .append('rect')
                        .attr('height', barHeight)
                        .attr('width', 140)
                        .attr('x', Math.round(margin / 2))
                        .attr('y', function (d, i) {
                            return i * (barHeight + barPadding);
                        })
                        .attr('fill', function (d) {
                            return color(d[$scope.point]);
                        })
                        .transition()
                        .duration(1000)
                        .attr('width', function (d) {
                            return xScale(d[$scope.point]);
                        });

                    svg.selectAll('text')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('fill', '#fff')
                        .attr('y', function (d, i) {
                            return (i * (barHeight + barPadding)) + 15;
                        })
                        .attr('x', 15)
                        .text(function (d) {
                            return d[$scope.label] + ' (' + d[$scope.point] + ')';
                        });
                };

                $scope.render();
            }
        };
    }

    Directive.$inject = ['d3Service'];
    return Directive;
});


