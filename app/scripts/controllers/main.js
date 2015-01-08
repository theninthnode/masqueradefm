'use strict';

angular.module('masqueradeApp')
.controller('MainCtrl', function ($scope, $rootScope, $q, $timeout, ngProgress, $firebase, $firebaseSimpleLogin, SavedService) {

	var t_promise;
	var orig_text = "Click to reveal";
	var timer;
	
	$scope.playlist = [];
	$scope.playingNow = null;
	$scope.second = null;
	$scope.revealed = false;
	$scope.cover_img = false;
	$scope.cover_txt = orig_text;
	$scope.is_loaded = false;
	$scope.title;
	$scope.current_is_saved = false;
	$scope.user;

    $scope.banned;

    var dataRef = new Firebase("https://masquerade.firebaseio.com");
	$scope.loginObj = $firebaseSimpleLogin(dataRef);
	
	$scope.genres = [
		{genre: "alternative", on: true, tracks: []},
		{genre: "ambient", on: true, tracks: []},
		{genre: "blues", on: true, tracks: []},
		{genre: "country", on: true, tracks: []},
		{genre: "classical", on: true, tracks: []},
		{genre: "dance", on: true, tracks: []},
		{genre: "dubstep", on: true, tracks: []},
		{genre: "electronic", on: true, tracks: []},
		{genre: "indie-rock", on: true, tracks: []},
		{genre: "jazz", on: true, tracks: []},
		{genre: "folk", on: true, tracks: []},
		{genre: "metal", on: true, tracks: []},
		{genre: "pop", on: true, tracks: []},
		{genre: "punk", on: true, tracks: []},
		{genre: "rock", on: true, tracks: []},
		{genre: "singer-songwriter", on: true, tracks: []},
		{genre: "soul", on: true, tracks: []},
		{genre: "urban", on: true, tracks: []},
	];

	$scope.applyFilter = function(genre){
		genre.on = !genre.on;
		buildPlaylist();
	};

	$scope.doReveal = function(){
		if($scope.second > 0)
			return true;

		var artwork_url = $scope.playingNow.artwork_url;
		$scope.title = $scope.playingNow.title;
		if(artwork_url) {
			var new_art = artwork_url.replace("large.jpg","crop.jpg");
			$scope.cover_img = new_art;
			$scope.revealed = true;
		} else {
			$scope.revealed = false;
			// $scope.cover_txt = $scope.playingNow.title;
			$scope.cover_txt = '';
		}
	}

	function getTracks(genre,promises){
		var deferred = $q.defer();
		var obj;
		SC.get('/tracks', { genres: genre.genre, "duration[from]": 180000 }, function(tracks) {
			tracks.forEach(function(track){
				if(typeof track.stream_url !== "undefined") {
					obj = {
						src:track.stream_url+"?client_id=d9b439ba055391c1950401ecc3940720", type:"audio/mp3", genre: genre.genre, title: track.title, artwork_url: track.artwork_url, sc_id:track.id
					};
					genre.tracks.push(obj);
				}
			});
			ngProgress.set((ngProgress.status() + 5));
			deferred.resolve();
		});

		promises.push(deferred.promise);
	}

	function fetchPlaylists() {
		var promises = [],new_order;

		ngProgress.color("#428bca");
		ngProgress.set(0);
		
		$scope.genres.forEach(function(genre){
			getTracks(genre,promises);
		});
		
		$q.all(promises).then(function() {
			buildPlaylist();
		});
	}

	function buildPlaylist() {
		var t_collection = [];
		var approved_genres = _.where($scope.genres,{on:true});

		approved_genres.forEach(function(genre){
			t_collection = t_collection.concat(genre.tracks);
		});

		t_collection = _.shuffle(t_collection);

		$scope.playlist.splice(0,$scope.playlist.length);
		t_collection.forEach(function(t){
			$scope.playlist.push(t);
		});
	}

	// initial playlist fetch
	fetchPlaylists();

	function countDown() {
	    $scope.second = 10;
	    setCounterText();
	    timer = setInterval(function(){
	    	if($scope.second === 1) {
	    		clearTimeout(timer);
	    		$scope.second = null;
	    	} else {
		    	$scope.second--;
	    	}
	    	setCounterText();
	    },1000);
	}

	function setCounterText(){
		var text = '';
		if($scope.second != null) {
			text += $scope.second;
		} else {
			text = orig_text;
		}
		$scope.cover_txt = text;
	}

	$scope.save = function(){
    	if(angular.isObject($scope.playingNow) && angular.isObject($scope.user)) {
	 		// $scope.saved.$add($scope.playingNow);
	 		SavedService.addSaved($scope.user.id, $scope.playingNow);
	 		$scope.current_is_saved = true;
    	}
    };

    $scope.ban = function(){
    	if(angular.isObject($scope.playingNow) && $scope.banned) {
	 		$scope.banned.$add($scope.playingNow);
    	}
    };

    // events

	$scope.$on('audioplayer:play', function (event, playlistIndex) {
      $scope.playingNow = $scope.playlist[playlistIndex];
	  countDown();
    });

    $scope.$on('audioplayer:load', function (event, playlistIndex) {
		$scope.title = '';
		$scope.revealed = false;
		$scope.current_is_saved = false;
		clearTimeout(timer);

		// sets progress bar to complete if loaded initial track
		if($scope.is_loaded === false) {
			ngProgress.complete();
			$scope.is_loaded = true;
		}

    });

    $scope.loginObj.$getCurrentUser().then(function(user){
    	if(user) {
    		$scope.user = user;
		    $scope.banned = $firebase(new Firebase("https://masquerade.firebaseio.com/banned/"+user.id));
    	}
    });

});
