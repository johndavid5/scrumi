angular.module('waldoApp')
.service('UserSvc', function($http, SharedUtilsSvc){

	var svc = this;

	svc.getUser = function(){
		//return $http.get('/api/users', {
		//	headers: {'X-Auth': this.token }
		//});

		// We'll automatically include the "x-auth" header
		// for every request below when
		// we set $http.default.headers()...
		return $http.get(SharedUtilsSvc.getUrlPrefix() + '/api/users');
	};

	// Two Step Login Process:
	// 1st: Call POST /api/sessions to get a JWT
	//   (JSON Web Token or "jot" for authentication)
	//
	// 2nd: Call GET /api/users to get the currently
	//   logged-in user's information. 
	//
	svc.login = function(username, password){
		return $http.post(SharedUtilsSvc.getUrlPrefix() + '/api/sessions', {
			username: username, password: password
		}).then( function(val){
			console.log("user.svc.js: Posted username = \"username\" with password to /api/sessions, got back val = " + JSON.stringify(val) + "...");
			svc.token = val.data;
			console.log("I have just set svc.token equal to val.data...svc.token = \"" + svc.token + "\"...");

			// NEW!  All requests will now have the authorization
			// header attached automagically...isn't that neat!
			$http.defaults.headers.common['X-Auth'] = val.data;
			
			return svc.getUser();
		});
	};
});
