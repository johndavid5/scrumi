angular.module('waldoApp')
//.controller('FilingsDetailCtrl', function($scope, FilingsSvc, PeopleSvc, $routeParams){
// Try using inline injection annotation to avoid problemas with minification...
.controller('ObjectivesDetailCtrl', ['$scope', 'ObjectivesSvc', 'UtilsSvc', 'SharedUtilsSvc', '$routeParams', '$window', '$controller', function($scope, ObjectivesSvc, UtilsSvc, SharedUtilsSvc, $routeParams, $window, $controller ){

	$scope.sWho = "ObjectivesDetailCtrl";

	// This is how we access the ApplicationCtrl for user information...
    // Of course, it would probably be better to use a shared service,
    // but it would have to be a stateful service...
	// http://stackoverflow.com/questions/25417162/how-do-i-inject-a-controller-into-another-controller-in-angularjs
	var applicationCtrlViewModel = $scope.$new();

	//You need to supply a scope while instantiating.
    //Provide the scope, you can also do $scope.$new(true)
    // in order to create an isolated scope.
    //In this case it is the child scope of this scope.
	$controller('ApplicationCtrl', {$scope: applicationCtrlViewModel});

	$scope.getUser = function(){
		return applicationCtrlViewModel.currentUser;
	}

	//$scope.debug_html = false;
	$scope.debug_html = UtilsSvc.stringToBool( $routeParams.debug_html );
	//$scope.debug_html = true

	$scope.id = $routeParams.id;

	console.log($scope.sWho + "(): $scope.id = \"" + $scope.id + "\"...");

	$scope.fetch_objective = function(){

		ObjectivesSvc.fetch({accessionNumber: $routeParams.accessionNumber})

		.success(function(objectives){

			console.log("FormsDetailCtrl: SHEMP: Hey, Moe,...I'm setting $scope.objective to objectives[0] = ", objectives[0], "...");

			$scope.objective = objectives[0];
		});
	}; /* $scope.fetch_objective() */

	$scope.fetch_objective();

}]);


