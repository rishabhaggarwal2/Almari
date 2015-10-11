'use strict';

angular.module('myApp.borrow', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/borrow', {
    templateUrl: 'views/borrow.html',
    controller: 'BorrowCtrl'
  });
}])

.controller('BorrowCtrl', ['$scope','ParseService', '$location', function($scope, ParseService, $location) {
	$scope.categories = ["Party", "Formal", "Wedding", "Cultural", 'Accessories', "Prom",];

	$scope.products = [];

	$scope.showProducts = function() {
	    ParseService.findProducts({}, function(err, results) {
	      $scope.products = results;
	      $scope.$apply();
	    });
	};



  	$scope.showProducts();

  	$scope.selectedCategory = "";
  	$scope.categorySelected = "";
  	$scope.selectPageCategory = function(category){
		$scope.selectedCategory = category;
		$scope.categorySelected = "pageSelected";
		 ParseService.findProducts({category:category}, function(err, results) {
	      $scope.products = results;
	      $scope.$apply();
	      
	    });
	};


	$scope.open = function(product){

		var url = "/product?pid="+product.get('productId');
		$location.url(url);
	};

}]);