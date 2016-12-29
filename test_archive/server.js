console.log("Welcome back, John...so glad you could make it...!");

var expect = require("chai").expect;

var request = require("request"); // Use for HTTP requests. 

var config = require("../app/config.js");
var logger = require("../app/logger.js");

var Common = require("./common"); // Test data for both server.js and finder.js


describe("Finder API", function(){

	describe("POST host", function(){

		var sWhat = "POST host";
		var url = "http://" + config.host + ":" + config.port + "/host";

		var hosts = Common.hosts; // Array of host names.

		// Due to ES5's function-level scoping,
		// if you want so use the elements of the hosts array to each run a test,
		// you need to create the function with a closure for each i, or each hosts[i]...
		function createFunc(i) {
			return function(done){

					var req_body = {form: { name: hosts[i] }};
		
					logger.debug(sWhat + ": i = " + i + ": posting to url = \"" + url + "\"..." );
					logger.debug(sWhat + ": i = " + i + ": posting req_body = ", req_body, "..." );
		
					request.post(url, req_body, function(error, response, body){
						logger.debug(sWhat + ": i = " + i + ": statusCode = \"" + response.statusCode + "\"...");
						logger.debug(sWhat + ": i = " + i + ": body = ", body, "...");
						expect(response.statusCode).to.equal(200);
						done();
					});

				}
		}

		var funcs = []; // To store our closures...

		for( var i = 0; i < hosts.length; i++ ){
			// Create a closure for each i...
			funcs[i] = createFunc(i);
		}

		for( var j = 0; j < hosts.length; j++ ){
			// Run the closure for each i...
			it( "returns status 200 for new host " + j + ": " + hosts[j] , funcs[j] );
		}

		// Or using ES6's "let" for block-level scoping...this sure is simpler, isn't it...?
		//for( let i = 0; i < hosts.length; i++ ){
		//	it("returns status 200",
		//		function(done){
		//
		//				//var req_body = {form: { name: "topper", number: 1 }};
		//				var req_body = {form: { name: hosts[i] }};
		//
		//				logger.debug(sWhat + ": i = " + i + ": posting to url = \"" + url + "\"..." );
		//				logger.debug(sWhat + ": i = " + i + ": posting req_body = ", req_body, "..." );
		//
		//				request.post(url, req_body, function(error, response, body){
		//					logger.debug(sWhat + ": statusCode = \"" + response.statusCode + "\"...");
		//					logger.debug(sWhat + ": body = ", body, "...");
		//					expect(response.statusCode).to.equal(200);
		//					done();
		//				});
		//
		//		}
		//	); 
		//}/* for( let i = 0; i < hosts.length; i++ ) */


	});

	describe("GET hosts", function(){

		var sWhat = "GET hosts";
		var url = "http://" + config.host + ":" + config.port + "/hosts";

		it("returns host list and status 200",
			function(done){

				logger.debug(sWhat + ": getting url = \"" + url + "\"..." );

				var hosts = Common.hosts; // Array of host names.

				request(url, function(error, response, body){
					logger.debug(sWhat + ": statusCode = \"" + response.statusCode + "\"...");
					logger.debug(sWhat + ": body = \"" + body + "\"...");
					logger.debug(sWhat + ": JSON.stringify(hosts) = ", JSON.stringify(hosts), "...");
					expect(response.statusCode).to.equal(200);
					expect(body).to.equal(JSON.stringify(hosts));
					done();
				});
			}
		); 

	});


	describe("POST link", function(){

		var sWhat = "POST link";
		var url = "http://" + config.host + ":" + config.port + "/link";

		var links = Common.links; // Array of links.

		// Due to ES5's function-level scoping,
		// if you want so use the elements of the links array to each run a test,
		// you need to create the function with a closure for each i, or each links[i]...
		function createFunc(i) {
			return function(done){

					var req_body = {form: { name_from: links[i].host_from, description: links[i].description, name_to: links[i].host_to }};
		
					logger.debug(sWhat + ": i = " + i + ": posting to url = \"" + url + "\"..." );
					logger.debug(sWhat + ": i = " + i + ": posting req_body = ", req_body, "..." );
		
					request.post(url, req_body, function(error, response, body){
						logger.debug(sWhat + ": i = " + i + ": statusCode = \"" + response.statusCode + "\"...");
						logger.debug(sWhat + ": i = " + i + ": body = ", body, "...");
						expect(response.statusCode).to.equal(200);
						done();
					});

				}
		}

		var funcs = []; // To store our closures...

		for( var i = 0; i < links.length; i++ ){
			// Create a closure for each i...
			funcs[i] = createFunc(i);
		}

		for( var j = 0; j < links.length; j++ ){
			// Run the closure for each i...
			it( "returns status 200 for new link " + j + ": " + links[j].host_from + " => " + links[j].description + " => " + links[j].host_to,
					funcs[j] );
		}

	});

	describe("GET links", function(){

		var sWhat = "GET links";
		var url = "http://" + config.host + ":" + config.port + "/links";

		var links = Common.links; // Array of links.

		it("returns list of links and status 200",
			function(done){

				logger.debug(sWhat + ": getting url = \"" + url + "\"..." );

				var hosts = Common.hosts; // Array of host names.

				request(url, function(error, response, body){
					logger.debug(sWhat + ": statusCode = \"" + response.statusCode + "\"...");
					logger.debug(sWhat + ": body = \"" + body + "\"...");

					var incoming_links = JSON.parse(body);
					logger.debug(sWhat + ": incoming_links.length =", incoming_links.length, "...");
					//logger.debug(sWhat + ": JSON.stringify(incoming_links) = ", JSON.stringify(incoming_links), "...");
					logger.debug(sWhat + ": incoming_links = ", incoming_links, "...");

					function links_compare(x,y){
							if( x.host_from == y.host_from 
									&&
								x.description == y.description
									&&
								x.host_to == y.host_to ){
								return 0;
							}
							else if( x.host_from < y.host_from ){
								return -1;
							}
							else if( x.host_from > y.host_from ){
								return 1;
							}
							else if( x.description < y.description ){
								return -1;
							}
							else if( x.description > y.description ){
								return 1;
							}
							else if( x.host_to < y.host_to ){
								return -1;
							}
							else if( x.host_to > y.host_to ){
								return 1;
							}
							else {
								return 0;
							}
					}/* links_compare() */

					incoming_links.sort( links_compare );

					logger.debug(sWhat + ": After sorting, incoming_links = ", incoming_links, "...");

					logger.debug(sWhat + ": links.length =", links.length, "...");
					//logger.debug(sWhat + ": JSON.stringify(links) = ", JSON.stringify(links), "...");
					logger.debug(sWhat + ": links = ", links, "...");

					links.sort( links_compare );
					logger.debug(sWhat + ": After sorting, links = ", links, "...");

					expect(response.statusCode).to.equal(200);
					expect(incoming_links.length).to.equal(links.length);
					expect(incoming_links).to.deep.equal(links);

					done();
				});
			}
		); 

	});

	describe("GET path", function(){

		var sWhat = "GET path";


		var path_finders = Common.path_finders; // Array of paths to find...

		// Due to ES5's function-level scoping,
		// if you want so use the elements of the links array to each run a test,
		// you need to create the function with a closure for each i, or each links[i]...
		function createFunc(i) {
			return function(done){

					var url = "http://" + config.host + ":" + config.port + "/path/" + path_finders[i].host_from + "/to/" + path_finders[i].host_to;
					logger.debug(sWhat + ": i = " + i + ": url = \"" + url + "\"..." );
		
					request(url, function(error, response, body){
						logger.debug(sWhat + ": i = " + i + ": statusCode = \"" + response.statusCode + "\"...");
						logger.debug(sWhat + ": i = " + i + ": body = ", body, "...");

						var response_path = JSON.parse(body);
						logger.debug(sWhat + ": i = " + i + ": response_path.length = ", response_path.length, "...");
						logger.debug(sWhat + ": i = " + i + ": response_path = ", response_path, "...");

						var expected_path = path_finders[i].expected_path; 
						logger.debug(sWhat + ": i = " + i + ": expected_path.length = ", expected_path.length, "...");
						logger.debug(sWhat + ": i = " + i + ": expected_path = ", expected_path, "...");

						expect(response.statusCode).to.equal(200);
						expect(response_path.length).to.equal(expected_path.length);
						expect(response_path).to.deep.equal(expected_path);

						done();
					});

				}
		}

		var funcs = []; // To store our closures...

		for( var i = 0; i < path_finders.length; i++ ){
			// Create a closure for each i...
			funcs[i] = createFunc(i);
		}

		for( var j = 0; j < path_finders.length; j++ ){
			// Run the closure for each i...
			it( "returns shortest path and status 200 for " + " " + j + ": " + path_finders[j].host_from + " => " + path_finders[j].host_to,
							funcs[j] );
		}

	});

});

console.log("Let off some steam, Bennett!");
