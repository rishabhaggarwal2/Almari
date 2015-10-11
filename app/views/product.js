'use strict';

angular.module('myApp.product', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/product', {
    templateUrl: 'views/product.html',
    controller: 'ProductController'
  });
}])

.controller('ProductController', ['$scope','$location', 'ParseService', function($scope, $location, ParseService) {

	

	var params = $location.search();
	console.log(params);


	// ParseService.findProductByPid(params.pid, function(err, results) {
 //      $scope.products = results;
 //      $scope.$apply();
 //      console.log(results);
 //    });

    ParseService.findProducts({productId:params.pid}, function(err, results) {
      $scope.products = results;
      $scope.$apply();
      console.log(results);
      $scope.product.name = $scope.products[0].get('name');
      $scope.product.imageUrl = $scope.products[0].get('imageUrl');
      $scope.product.company = $scope.products[0].get('company');
      $scope.product.size = $scope.products[0].get('size');
      $scope.product.gender = $scope.products[0].get('gender');
      $scope.product.category = $scope.products[0].get('category');
      $scope.product.price = $scope.products[0].get('price');
      $scope.product.description = $scope.products[0].get('description');
	 });

}]);