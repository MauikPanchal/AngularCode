angular.module('starter.controllers', ['ngCordova', 'ngCordovaOauth'])

.controller('DashCtrl', function($scope, $http, $q, $ionicModal, $timeout, $rootScope, $state, $ionicPopup, $timeout, $location, authenticationFactory, $cordovaOauth, GOOGLE_API_KEY, ngGoogle) {
	$scope.googleLogin = function(){
		ngGoogle.getAuth().then(function(result) {
				authenticationFactory.setAuthentication(result.access_token);
				$state.go('tab.account');
		}, function(error) {
				console.log("Error -> " + error);
		});
	}//Google Auth
})

.controller('ChatsCtrl', function($scope,$http, $q, $ionicModal, $timeout, $rootScope, $state, $ionicPopup, $timeout, $location, authenticationFactory, GOOGLE_API_KEY, ngGoogle) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
		ngGoogle.getFriends().then(function(result) {
			$rootScope.chats = result.data;
		}, function(error) {
			alert("Error: "+error);
		});
		$scope.sendMessage = function(responce){
			ngGoogle.sendRestricted();
		};
  //$scope.chats = Chats.all();
})

.controller('ChatDetailCtrl', function($scope, $ionicModal, $timeout, $rootScope, $state, $ionicPopup, $timeout, $location, authenticationFactory, $stateParams, Chats, ngGoogle) {
  //$scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $http, $q, $ionicModal, $timeout, $rootScope, $state, $ionicPopup, $timeout, $location, $q, authenticationFactory, ngGoogle, GOOGLE_API_KEY, ngGoogle) {
		
		ngGoogle.getUserInfo().then(function(userInfo) {
			$rootScope.userInfo = userInfo;
		}, function(error) {
			alert("Error: "+error);
		});
		//console.log($rootScope.userInfo);
});
