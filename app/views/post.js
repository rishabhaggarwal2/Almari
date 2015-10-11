'use strict';

angular.module('myApp.post', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/post', {
    templateUrl: 'views/post.html',
    controller: 'PostCtrl'
  });
}])

.controller('PostCtrl', ['$scope', 'ParseService', '$location', function($scope, ParseService, $location) {
	$scope.sizes= ["XS", "S", "M", "L", "XL","OS"];
	$scope.genders = ["M","F"];
	$scope.product = {};
	$scope.categories = ["Party","Wedding","Prom", "Formal", "Cultural", 'Accessories'];
	
	$scope.selectSize = function(size){
		$scope.product.size = size;
	};
	$scope.selectGender = function(gender){
		$scope.product.gender = gender;
	};
	$scope.selectCategory = function(category){
		$scope.product.category = category;
	};
	$scope.updateImage = function(){
		var url = {
			"gap":"http://www.gap.com",
			"banana":"http://www.bananarepublic.gap.com",
			"banana republic":"http://www.bananarepublic.gap.com"
		};
		$scope.product.imageUrl = url[$scope.product.company.toLowerCase()]+"/resources/productImage/v1/"+$scope.product.productId+"/P01";
	};

  $scope.submitProduct = function() {
    ParseService.addProduct($scope.product, function(err, product) {
      if (err) {
        $('.submit-product-error').text(err.message).slideDown();
      } else {
        alert('Sucessful submit');
        $location.url('/borrow');
        $scope.$apply();
      }
    })
  };
}]);