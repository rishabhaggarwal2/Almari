'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/app', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  })

.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        elem.off(attr.eventFocus);
      });
    };
  })

.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
})


.controller('View1Ctrl', ['$scope', 'Upload', '$timeout', '$http','focus','$window',
function ($scope, Upload, $timeout, $http, focus, $window) {
	$scope.lol = function(){
		alert("numb");
	};

    $scope.f;
    $scope.myForm;
    $scope.process = 1;
    $scope.formName;
    $scope.loaded = false;

    $scope.languages = {
        english: "en",
        spanish: "en-us",
        french: "en-fr",
        korean: "en-ko",
        japanese: "en-ja"
    };
    $scope.error = false;
    $scope.currentLanguage = "english";

    $scope.selectLanguage  = function(language){
        $scope.currentLanguage = language;        
    };

    $scope.nextProcess = function(){
        $scope.process++;

        if($scope.process == 2){
            $http.get('http://formforme.cloudapp.net:5000/'+$scope.formName+'/'+$scope.languages[$scope.currentLanguage]).
              then(function(response) {
                $scope.loaded = true;
                $scope.formData = response.data;
                focus('input'+$scope.currentStep);
              }, function(response) {
                $scope.error = true;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    };
    $scope.formExamples = ["f990sn-14", "f1099a-15", "f1120w15", "fw10" ]

    
	$scope.uploadFiles = function(file) {
        $scope.f = file;
        console.log('done');
        console.log(file);
        console.log(file.$error);
        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                file: file
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });

            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                                       evt.loaded / evt.total));
                console.log(file.progress);
            });
        }   
        else{
            console.log('Error');
        }
    };

    $scope.nextStep = function(){
        $scope.currentStep++;
        focus('input'+$scope.currentStep);
        $scope.scrollTo();
    };

    $scope.makeCurrentStep = function(index){
        $scope.currentStep = index;
        focus('input'+$scope.currentStep);
        $scope.scrollTo();
    };

    $scope.scrollTo = function(){
        var positon = $('#input'+$scope.currentStep).offset().top - 200;
        $('html,body').animate({scrollTop: positon }, "slow");
    };

    $scope.currentStep = 0;


    $scope.submitForm = function(){
        console.log("sent");

        // $.ajax({
        //   url:'http://formforme.cloudapp.net:5000/'+$scope.formName,
        //   type:"POST",
        //   data:$scope.formData,
        //   contentType:"application/json; charset=utf-8",
        //   dataType:"json",
        //   success: function(data){
        //     console.log( "Data Loaded: " + data );
        //   }
        // })
        
        $.post( 'http://formforme.cloudapp.net:5000/'+$scope.formName, $scope.formData)
          .done(function( data ) {
            window.setTimeout(function(){
                $window.open('http://formforme.cloudapp.net:5000/pdfs/output.pdf');
            }, 1000);
          });

          

        // $http({
        //     url: 'http://formforme.cloudapp.net:5000/'+$scope.formName,
        //     method: 'POST',
        //     dataType: 'json',
        //     data: $scope.formData,
        //     headers: {
        //         "Content-Type": "x-www-form-urlencoded"
        //     }

        // }).success(function(response){
        //     console.log($scope.formData);
        //     console.log('success', response);
        // }).error(function(error){
        //     console.log('error');
        // });

        // $http.post('http://formforme.cloudapp.net:5000/'+$scope.formName, JSON.stringify({message: "Rishabh"})).
        //   then(function(response) {
        //     console.log("yes", response);
        //     // this callback will be called asynchronously
        //     // when the response is available
        //   }, function(response) {
        //     console.log("no");
        //     // called asynchronously if an error occurs
        //     // or server returns response with an error status.
        //   });


    };

    focus('startInput');
}]);