'use strict';

angular.module('masqueradeApp')
.controller('SavedCtrl', function ($scope, $rootScope, $firebase, $firebaseSimpleLogin, SavedService) {
	
	$scope.playlist = [];
	$scope.saved = {};
	$scope.playingNow = null;
	$scope.cover_img = false;
	$scope.cover_txt;
	$scope.is_loaded = false;

	var dataRef = new Firebase("https://masquerade.firebaseio.com");
	$scope.loginObj = $firebaseSimpleLogin(dataRef);

	$scope.$on('audioplayer:play', function (event, playlistIndex) {
      $scope.playingNow = $scope.playlist[playlistIndex];
    });

    $scope.$on('audioplayer:load', function (event, playlistIndex) {

    });

    $scope.loginObj.$getCurrentUser().then(function(user){
    	$scope.playlist = $firebase(new Firebase("https://masquerade.firebaseio.com/saved/"+user.id));
		
		// $scope.saved.$on('loaded', function() {
		// 	buildPlaylist();
		// });
    });

    function buildPlaylist() {
    	console.log($orderByPriority($scope.saved));
    }

    $scope.remove = function(track) {
    	$scope.playlist.$remove(track);
    }

});
