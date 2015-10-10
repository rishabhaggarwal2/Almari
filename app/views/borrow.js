'use strict';

angular.module('myApp.borrow', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/borrow', {
    templateUrl: 'views/borrow.html',
    controller: 'BorrowCtrl'
  });
}])

.controller('BorrowCtrl', [function() {

}]);