'use strict';
/* DUMB TEST CONTROLLER TEMPLATE STUFF BECAUSE KARMA JASMINE NPM TEST IS A BIGGER SHITE SHOW THAN GIT CLONING A RAILS APP AND TRYING TO GET 'rails s' TO WORK */

angular.module('parseService.test', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test', {
    templateUrl: 'test/test.html',
    controller: 'parseTestCtrl'
  });
}])

.controller('parseTestCtrl', ['$scope', 'ParseService',
function($scope, ParseService) {
  $scope.products = [];
  $scope.showProducts = function() {
    ParseService.findProducts({}, function(err, results) {
      $scope.products = results;
    });
  };

  $scope.showProducts();
}]);