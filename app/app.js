'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.borrow',
  'myApp.post',
  'myApp.landing',
  'myApp.nav',
  'myApp.product',
  'myApp.version',
  // uncomment to load local env vars and use 'config' global constant
  // 'myApp.env',
  'ngFileUpload',
  'ui.bootstrap',
  'parseService',
  'parseService.test'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/landing'});
}]);
