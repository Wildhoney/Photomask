import angular from 'angular';
import {transform, readAttributes} from '../../src/core';

angular.module('maskApp', []).directive('photomask', PhotomaskDirective).controller('MainController', MainController);

function MainController($scope) {

    $scope.options = {
        text: 'Photomask',
        src: 'images/meadows.jpg',
        paddingLeft: 50,
        paddingTop: 8
    };

}

function PhotomaskDirective() {

    return {
        restrict: 'C',
        scope: false,
        link: (scope, element) => {

            element[0].addEventListener('load', () => {
                console.log('x');
            });

            function process() {
                const img = element[0];
                transform(img, scope.options);
            }

            scope.$watch('options', process, true);

        }
    };

}
