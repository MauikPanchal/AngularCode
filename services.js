angular.module('starter.services', ['ngCordova', 'ngCordovaOauth'])

.factory('authenticationFactory',[function() {
	//Initialization auth data
	var authenticationFactory = {};
	authenticationFactory.getAuthentication = function(){
		return authenticationFactory.authToken;
	} //get auth info of current user
	
	authenticationFactory.setAuthentication = function(authToken){
		console.log(authToken);
		authenticationFactory.authToken = authToken;
	}//set auth info of current user
	
	
	return authenticationFactory;
}]) //authenticationFactory to get and set auth
.factory('ngGoogle', function($http, $q, $window, $cordovaOauth, GOOGLE_API_KEY, $rootScope, authenticationFactory) {
	var users = [];

	return {
		getAuth:function(){
			return $cordovaOauth.google(GOOGLE_API_KEY, [
				"https://www.googleapis.com/auth/plus.login",
				"https://www.googleapis.com/auth/plus.me",
				"https://www.googleapis.com/auth/plus.stream.read",
				"https://www.googleapis.com/auth/plus.stream.write",
				"https://www.googleapis.com/auth/plus.circles.read",
				"https://www.googleapis.com/auth/plus.circles.write",
				"https://www.googleapis.com/auth/plus.circles.read",
				"https://www.googleapis.com/auth/plus.profiles.read",
				"https://www.googleapis.com/auth/userinfo.email", 
				"https://www.googleapis.com/auth/userinfo.profile"
			]).then(function(response){
				//authenticationFactory.setAuthentication(response.access_token);
				users = response;
				return users;
			}, function(error){
				//something went wrong!
				//Optionally, we can just: return error;
			});
		},
		getUserInfo: function(){
			var token = authenticationFactory.getAuthentication();
			return $http.get("https://www.googleapis.com/plus/v1/people/me?key="+GOOGLE_API_KEY, { 
				params: {
					access_token: token, 
					fields:'aboutMe,ageRange,birthday,braggingRights,circledByCount,cover,currentLocation,displayName,domain,emails,etag,gender,id,image,isPlusUser,kind,language,name,nickname,objectType,occupation,organizations,placesLived,plusOneCount,relationshipStatus,skills,tagline,url,urls,verified',
					//fields:'aboutMe,birthday,displayName,emails,gender,id,image,isPlusUser,url,urls',
					format: "json"
				}
			}).then(function(response){
				users = response;
				return users;
			}, function(error){
				//something went wrong!
				//Optionally, we can just: return error;
			});
		},
		getFriends: function(){
			var token = authenticationFactory.getAuthentication();
			return $http.get("https://www.googleapis.com/plus/v1/people/me/people/visible?key="+GOOGLE_API_KEY, { 
				params: {
					access_token: token, 
					format: "json"
				}
			}).then(function(response){
				users = response;
				return users;
			}, function(error){
				//something went wrong!
				//Optionally, we can just: return error;
			});
		},
		sendRestricted: function(){
			//var deferred = $q.defer();
			var token = authenticationFactory.getAuthentication();
			console.log(token);
			var content = '{"object": {"originalContent": "Happy Monday!#caseofthemondays"},"access":{"kind":"plus#acl","items":[{"type":"domain"}],"domainRestricted":true}}';
			$http({
              method: "post",
              url: "https://www.googleapis.com/plusDomains/v1/people/me/activities?preview=false&fields=access%2Cobject%2ForiginalContent&access_token="+token+"&key="+GOOGLE_API_KEY,
              headers: {
                  "Authorization": "OAuth"+token,
                  "Content-Type": "application/json"
              },
              data: content
            })
			.success(function(response) {
				console.log(JSON.stringify(response));
				users = response;
				return users;
				//deferred.resolve(response);
			  })
			  .error(function(error) {
				  console.log(JSON.stringify(error));	
				//deferred.reject(error);
			  })
		},
		sendPost: function(){
			var token = authenticationFactory.getAuthentication();
			var postContent =	'"object": {"originalContent": "Happy Monday! #caseofthemondays",},"access": {"items": [{"type": "domain"}],"domainRestricted": true}';

			//return $http.post("https://www.googleapis.com/plusDomains/v1/people/me/activities?preview=true&fields=object%2ForiginalContent&key="+GOOGLE_API_KEY, { 
			return $http.post("https://www.googleapis.com/plusDomains/v1/people/me/activities?preview=false&fields=access%2Cobject%2ForiginalContent&key="+GOOGLE_API_KEY, postContent).then(function(response){
	
				console.log(JSON.stringify(response));
				users = response;
				return users;
			}, function(error){
				//something went wrong!
				//Optionally, we can just: return error;
			});
		}
	}
})