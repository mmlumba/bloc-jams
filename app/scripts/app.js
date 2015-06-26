/*require("./landing");
require("./collection");
require("./album");
require("./profile");
*/

var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',

  songs: [
     { name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
     { name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
     { name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
     { name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
     { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
    ]
};

blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
    url: '/',
    views: {
      '': {
        controller: 'Landing.controller',
        templateUrl: '/templates/landing.html'
      },
      'playerBar@landing': {
        templateUrl: '/templates/player_bar.html'
      }
    }
  });
  $stateProvider.state('collection', {
    url: '/collection',
    views: {
      '': {
        controller: 'Collection.controller',
        templateUrl: '/templates/collection.html'
      },
      'playerBar@collection': {
        templateUrl: '/templates/player_bar.html'
      }
    }
  });
  $stateProvider.state('album', {
    url: '/album',
    views: {
      '': {
        controller: 'Album.controller',
        templateUrl: '/templates/album.html'
      },
      'playerBar@album': {
        templateUrl: '/templates/player_bar.html'
      }
    }
  });
}]);

blocJams.controller('Landing.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger) {
  $scope.subText = "Turn the music up!"; //$scope connects the code in our controller and the HTML view

  $scope.subTextClicked = function() {
     $scope.subText += '!';
   };

   $scope.albumURLs = [
      '/images/album-placeholders/album-1.jpg',
      '/images/album-placeholders/album-2.jpg',
      '/images/album-placeholders/album-3.jpg',
      '/images/album-placeholders/album-4.jpg',
      '/images/album-placeholders/album-5.jpg',
      '/images/album-placeholders/album-6.jpg',
      '/images/album-placeholders/album-7.jpg',
      '/images/album-placeholders/album-8.jpg',
      '/images/album-placeholders/album-9.jpg',
    ];

  $scope.siteHead = "Bloc Jams";

  $scope.siteHeadClicked = function (o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    $scope.ConsoleLogger = ConsoleLogger;
    $scope.log = function(){
      ConsoleLogger.log();
    }

 }]);

 blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
   $scope.albums = [];
   $scope.showOverlay = false;

   for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   }

   $scope.playAlbum = function(album){
     SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
   }

   $scope.ConsoleLogger = ConsoleLogger;
   $scope.log = function(){
     ConsoleLogger.log();
   }
 }]);

 blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
   $scope.album = angular.copy(albumPicasso);

   var hoveredSong = null;

   $scope.onHoverSong = function(song) {
     hoveredSong = song;
   };

   $scope.offHoverSong = function(song) {
     hoveredSong = null;
   };

   $scope.getSongState = function(song) {
     if (song === SongPlayer.currentSong && SongPlayer.playing) {
       return 'playing';
     }
     else if (song === hoveredSong) {
       return 'hovered';
     }
     return 'default';
   };

   $scope.playSong = function(song) {
     SongPlayer.setSong($scope.album, song);
     SongPlayer.play();
    };

    $scope.pauseSong = function(song) {
      SongPlayer.pause();
    };

    $scope.ConsoleLogger = ConsoleLogger;
    $scope.log = function(){
      ConsoleLogger.log();
    }

 }]);

 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);

 blocJams.service('SongPlayer', function() {
   var currentSoundFile = null;
   var trackIndex = function(album, song) { //calculate the trackIndex of a song within a current album
     return album.songs.indexOf(song); //receives album and song, then uses JS indexOf function to determine song's location in an album
     //album.songs is from line 14; its a "songs" array with name and time info of each song
   };

   return {
     currentSong: null,
     currentAlbum: null,
     playing: false,

     play: function() {
       this.playing = true;
       currentSoundFile.play();
     },
     pause: function() {
       this.playing = false;
       currentSoundFile.pause();
     },
     next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong); //instantiation of trackIndex function
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) { //if the song is the last song...
         currentTrackIndex = this.currentAlbum.songs.length - 1;  //end the next function at song with index length-1
       }

       this.currentSong = this.currentAlbum.songs[currentTrackIndex];
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },
     previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) { //if the song is the first song..
         currentTrackIndex = 0;  //end the previous function at song with index 0
       }

       this.currentSong = this.currentAlbum.songs[currentTrackIndex];
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },
     setSong: function(album, song) {
       if (currentSoundFile) {
          currentSoundFile.stop();
        }
       this.currentAlbum = album;
       this.currentSong = song;
        currentSoundFile = new buzz.sound(song.audioUrl, {
          formats: [ "mp3" ],
          preload: true
      });

      this.play();
     }
   }; //end of return
 }); //end of service

 blocJams.service('ConsoleLogger', function(){
   return {
     //myMessage: null;
     log: function(){
       console.log(this.myMessage);
     }
   }
 });
