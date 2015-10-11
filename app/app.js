'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.borrow',
  'myApp.landing',
  'myApp.version',
  // uncomment to load local env vars and use 'config' global constant
  // 'myApp.env',
  'ngFileUpload',
  'ui.bootstrap',
  'parseService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/landing'});
}]);
