'use strict';

angular.module('masqueradeApp')
.controller('AuthCtrl', function ($scope, $state, $rootScope, $firebaseSimpleLogin) {

	var dataRef = new Firebase("https://masquerade.firebaseio.com");
	$scope.loginObj = $firebaseSimpleLogin(dataRef);

	$scope.$state = $state;

	$scope.fbLogin = function() {
		$scope.loginObj.$login('facebook').then(function(user) {
		   console.log('Logged in as: ', user.uid);
		}, function(error) {
		   console.error('Login failed: ', error);
		});
	};

});
