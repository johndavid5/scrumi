angular.module('waldoApp')
.service('ObjectivesSvc', function($http, UtilsSvc, SharedUtilsSvc){

	// Later try using the $resource service in ng-resource.js if you don't
	// want to be macho-wacho and use the "raw" $http service...
	this.fetch = function(options){

		var sWho = "ObjectivesSvc::fetch";

		console.log( sWho + "(): options = \"" + JSON.stringify( options ) + "\"...");

		// If we're gonna muck with the options, we'd better muck 
		// with a cloned copy of 'em, or else we'll muck up the caller's
		// options Object...
		var ourOptions = angular.copy( options ); 

		console.log( sWho + "(): ourOptions = \"" + JSON.stringify( ourOptions ) + "\"...");

		var url =  SharedUtilsSvc.getUrlPrefix() + '/api/objectives' + UtilsSvc.propertiesToQueryString(ourOptions);

		console.log( sWho + "(): Returning $http.get( \"" + url + "\" )...");

		return $http.get( url );
	}; /* this.fetch() */

	this.fetch_count = function(options){

		var sWho = "ObjectivesSvc::fetch_count";

		console.log( sWho + "(): options = \"" + JSON.stringify( options ) + "\"...");

		// If we're gonna muck with the options, we'd better muck 
		// with a cloned copy of 'em, or else we'll muck up the caller's
		// options Object...
		var ourOptions = angular.copy( options ); 
		ourOptions.countOnly = true;

		console.log( sWho + "(): ourOptions = \"" + JSON.stringify( ourOptions ) + "\"...");

		//var url =  '/api/forms' + UtilsSvc.propertiesToQueryString(ourOptions);
		var url =  SharedUtilsSvc.getUrlPrefix() + '/api/objectives' + UtilsSvc.propertiesToQueryString(ourOptions);

		console.log( sWho + "(): Returning $http.get( \"" + url + "\" )...");

		return $http.get( url );

	}; /* this.fetch_count() */



	//this.create = function(objective){
	//	return $http.post('/api/objectives', objective);
	//}
});
