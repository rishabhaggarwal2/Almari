'use strict';

angular.module('myApp.borrow', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/borrow', {
    templateUrl: 'views/borrow.html',
    controller: 'BorrowCtrl'
  });
}])

.controller('BorrowCtrl', ['$scope','ParseService', function($scope, ParseService) {
	$scope.categories = ["Party","Wedding","Prom", "Formal", "Cultural", 'Accessories'];

	$scope.products = [];

	$scope.showProducts = function() {
    ParseService.findProducts({}, function(err, results) {
      $scope.products = results;
    })};

    $scope.showProducts();

}]);