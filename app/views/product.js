'use strict';

angular.module('myApp.product', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/product', {
    templateUrl: 'views/product.html',
    controller: 'ProductController'
  });
}])

.controller('ProductController', ['$scope', function($scope) {
	$scope.product = {};
	$scope.product.imageURL = "http://www.gap.com/webcontent/0009/935/338/cn9935338.jpg";
	$scope.product.name = "Grey leather jacket";
	$scope.product.brand = "Old Navy";
	$scope.product.size = "XL";
	$scope.product.gender="F";
	$scope.product.category="Formal";
	$scope.product.price="$25";
	$scope.product.description= "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur.";

	$scope.selectSize = function(size){
		$scope.product.size = size;
	};
	$scope.selectGender = function(gender){
		$scope.product.gender = gender;
	};
	$scope.selectCategory = function(category){
		$scope.product.category = category;
	};
}]);