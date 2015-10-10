'use strict';

angular.module('myApp.landing', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/landing', {
    templateUrl: 'landing/landing.html',
    controller: 'landingCtrl'
  });
}])

.controller('landingCtrl', ['$location', '$scope', 'ParseService',
function($location, $scope, ParseService) {
	$(document).ready(function(){
		var text = "formsfor.me";
		var index = 0;
		var stringy = "";
		$(".splashText").focus();
		window.setTimeout(function(){
			window.setInterval(function(){
				if(index < text.length){
					stringy += text[index++];
					$(".splashText").val(stringy);	
				}
			}, 100);	
		}, 1000);
	});

	$scope.loggingIn = 0;

	$scope.loginShow = function(){
		$scope.loggingIn = !$scope.loggingIn;
		if ($scope.loggingIn) {
			$('.toggle-login').text('<');
		} else {
			$('.toggle-login').text('Login');
		}
	};

	$scope.lend = function(){
		$location.url('/post');
	};
	$scope.borrow = function(){
		$location.url('/borrow');
	};

	$scope.login = function() {
		ParseService.login($scope.signupUsername, $scope.signupPassword, function(err) {
			if (err) {
				alert("Bad email-password pair");
			}
		});
	};
}]);