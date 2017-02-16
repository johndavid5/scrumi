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

	this.newObjective = function(objective){

		var sWho = "ObjectivesSvc::newObjective";

		console.log( sWho + "(): SHEMP: Moe, objective = \"" + JSON.stringify( objective ) + "\"...");

		// If we're gonna muck with the objective, we'd better muck 
		// with a cloned copy of it, or else we'll muck up the caller's
		// objective Object, n'est-ce pas...?
		var ourObjective = angular.copy( objective ); 

		console.log( sWho + "(): ourObjective = \"" + JSON.stringify( ourObjective ) + "\"...");

		//var url =  SharedUtilsSvc.getUrlPrefix() + '/api/objectives' + UtilsSvc.propertiesToQueryString(ourOptions);
		var url =  SharedUtilsSvc.getUrlPrefix() + '/api/objectives';


		console.log( sWho + "(): Returning $http.post( ", url, ourObjective, ")...");

		return $http.post( url, ourObjective );

	}; /* this.newObjective() */


	// Later, try using the $resource service in ng-resource.js if you don't
	// want to be macho-wacho and use the "raw" $http service...
	this.updateObjective = function(objective){

		var sWho = "ObjectivesSvc::updateObjective";

		console.log( sWho + "(): SHEMP: Moe, objective = \"" + JSON.stringify( objective ) + "\"...");

		// If we're gonna muck with the objective, we'd better muck 
		// with a cloned copy of it, or else we'll muck up the caller's
		// objective Object, n'est-ce pas...?
		var ourObjective = angular.copy( objective ); 

		console.log( sWho + "(): ourObjective = \"" + JSON.stringify( ourObjective ) + "\"...");

		//var url =  SharedUtilsSvc.getUrlPrefix() + '/api/objectives' + UtilsSvc.propertiesToQueryString(ourOptions);
		var url =  SharedUtilsSvc.getUrlPrefix() + '/api/objectives';


		console.log( sWho + "(): Returning $http.put( ", url, ourObjective, ")...");

		return $http.put( url, ourObjective );

	}; /* this.updateObjective() */


	//this.create = function(objective){
	//	return $http.post('/api/objectives', objective);
	//}
});
