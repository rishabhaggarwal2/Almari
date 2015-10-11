'use strict';

angular.module('myApp.nav', ['ngRoute'])

.controller('navCtrl', ['$location', '$scope', 'ParseService',
function($location, $scope, ParseService) {

  $scope.loggingIn = 0;
  $scope.signupFlag = 0;
  $scope.username = '';

  $scope.loginShow = function() {
    $scope.loggingIn = $scope.loggingIn === 0 ? 1 : 0;
  };

  $scope.signupMode = function() {
    if ($scope.signupFlag === 0) {
      $('#inputConfirmPassword').show();
      $scope.signupFlag = 1;
    } else if ($scope.signupFlag === 1) {
      if ($scope.signupPassword !== $scope.signupConfirm) {
        $('.form-error').text('Passwords do not match').show();
        return;
      }
      ParseService.signUp($scope.signupUsername, $scope.signupPassword, function(err) {
        if (err) {
          $('.form-error').text(err.message).show();
        }
      });
    }
  };

  $scope.login = function() {
    ParseService.login($scope.signupUsername, $scope.signupPassword, function(err) {
      if (err) {
        $('.form-error').text(err.message).show();
      } else {
        $scope.username = ParseService.username();
        $scope.loggingIn = 2;
        $scope.$apply();
      }
    });
  };

  $scope.logout = function() {
    ParseService.logout();
    $scope.loggingIn = 0;
    $('.logout-btn').hide();
  }

  $scope.home = function() {
    $location.url('/landing');
  };

  $scope.usernamePoll = function() {
    $scope.username = ParseService.username();
    if ($scope.username.length > 0) {
      $scope.loggingIn = 2;
    }
  };

  $scope.showLogout = function() {
    $('.logout-btn').show().addClass('active');
  },
  $scope.hideLogout = function() {
    setTimeout(function() {
      $('.logout-btn').removeClass('active');
    }, 500);
  },

  $scope.$on('$locationChangeStart', function(e) {
    if ($scope.loggingIn === 1) {
      $scope.loggingIn = 0;
    }
    if ($scope.username.length > 0) {
      $scope.loggingIn = 2;
    }
  });

  // On page load
  $scope.usernamePoll();
}]);