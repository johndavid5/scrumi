angular.module('waldoApp')
.controller('LoginCtrl', function($scope, UserSvc, UtilsSvc, $routeParams){


	$scope.debug_html = UtilsSvc.stringToBool( $routeParams.debug_html );

	$scope.username = $routeParams.username;
	$scope.password = $routeParams.password; 

	//if(	$scope.debug_html ){
	//	$scope.username = "arnie";
	//	$scope.password = "pass1234";
	//}

	$scope.login = function(username, password){
		UserSvc.login(username, password)
		.then(function(response){
			console.log("* ./ng/login.ctrl.js: successful login of username = \"" + username + "\", response = ");
			console.log(response);

			// emit as event to bubble up to
			// parent controllers...
			$scope.$emit('login', response.data);
		});
	};

	$scope.isEmailValid = UtilsSvc.isEmailValid;

	$scope.emails = [
		"joe",
		"joe.kovacs@ptl.com"
	];

});
