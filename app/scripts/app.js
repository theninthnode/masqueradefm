'use strict';

angular.module('masqueradeApp', ['audioPlayer', 'ngProgress','firebase','ui.router']);
angular.module('masqueradeApp').config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/discover")
      
    $stateProvider
		.state('discover', {
		    url: '/discover',
		    views: {
		        'main': {
		            templateUrl: 'views/discover.html',
		            controller: 'MainCtrl'
		        },
		    },
		    menus: {
	            'header': {
	                identifier: 'discover',
	                class: 'active'
	            }
        	}
		})
		.state('saved', {
		    url: '/saved',
		    views: {
		        'main': {
		            templateUrl: 'views/saved.html',
		            controller: 'SavedCtrl'
		        },
		    },
		    menus: {
	            'header': {
	                identifier: 'saved',
	                class: 'active'
	            }
        	}
		});
 });
angular.module('masqueradeApp').filter('capitalize', function() {
	 return function(input, scope) {
	 if (input!=null)
	 input = input.toLowerCase();
	 return input.substring(0,1).toUpperCase()+input.substring(1);
	 }
	});