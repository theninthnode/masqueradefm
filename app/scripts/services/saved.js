'use strict';

angular.module("masqueradeApp")
  .factory("SavedService", function($firebase) {
    return {
      getSaved: function(user_id) {
        var ref = new Firebase("https://masquerade.firebaseio.com/saved/"+user_id);
        var tracks = [];
        ref.on("child_added", function(track) {
          tracks.push(track.val());
        });
        return tracks;
      },
      addSaved: function(user_id, track) {
        var ref = new Firebase("https://masquerade.firebaseio.com/saved/"+user_id);
        ref.push(track);
      }
    }
  });