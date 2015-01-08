'use strict';

angular.module('masqueradeApp')
.directive('activeMenu', ['$rootScope', '$state', function($rootScope, $state) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {


            var current = attrs.activeMenu.split('.'),
                menus = $state.current;
            
            console.log(current, menus);
        	
        	if(current.length < 2 || typeof menus !== 'object')
        		return;
        	
        	var menu = menus[current[0]];

        	if(typeof menu === 'undefined')
        		return;

            var _class = menu.class,
            	identifier = menu.identifier;
            
            if(typeof _class === 'undefined' || typeof identifier === 'undefined')
            	return; // does not have required data

            if(identifier === current[1]){
            	// element matches current $state so apply class
            	element.addClass(_class);
            	return;
            }
        }
    };
}]);