console.log("Welcome back, John...so glad you could make it...!");

var expect = require("chai").expect;

var request = require("request"); // Use for HTTP requests. 

var config = require("../config.js");
var logger = require("../logger.js");

var Common = require("./common"); // Test data for both server.js and finder.js

var sharedUtils = require('../ng/shared-utils.svc.js');


describe("Objectives API", function(){

	describe("GET objectives", function(){

		var sWhat = "GET objectives";
		var url = "http://" + "localhost" + ":" + config.port + sharedUtils.getUrlPrefix() + "/api/objectives";

		it("returns objectives list and status 200",
			function(done){

				logger.debug(sWhat + ": getting url = \"" + url + "\"..." );

				request(url, function(error, response, body){

					logger.debug(sWhat + ": error = \"" + error + "\"...");
					logger.debug(sWhat + ": response.statusCode = \"" + response.statusCode + "\"...");
					logger.debug(sWhat + ": body = \"" + body + "\"...");
					logger.debug(sWhat + ": typeof body = \"" + (typeof body) + "\"...");
					var objectives = JSON.parse( body );
					logger.debug(sWhat + ": objectives = ", objectives, "...");
					logger.debug(sWhat + ": objectives.length = \"" + objectives.length + "\"...");

					expect(objectives.length).to.be.at.least(1);


					expect(response.statusCode).to.equal(200);

					done();
				});
			}
		); 

	}); /* GET objectives */


});

console.log("Let off some steam, Bennett!");
