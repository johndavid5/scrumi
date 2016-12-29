var logger = require("../logger");

var expect = require("chai").expect;

var Objectives = require("../models/objectives");
var ourObjectives = new Objectives();

var Common = require("./common");

describe("Objectives", function(){

	describe("Objectives", function(){

		it("Get Objectives", function(){

			logger.info("./test/objectives.js: getObjectives() = ", ourObjectives.getObjectives );

			ourObjectives.getObjectives(
				function( objectives, length, err ){

					logger.info("./test/objectives.js: objectives = ", objectives );
					logger.info("./test/objectives.js: length = ", length );
					logger.info("./test/objectives.js: err = ", err );

					expect(objectives.length).to.be.at.least(1); 

					done();
				}
			);


			//logger.info("objectives.length = " + objectives.length );
			//for( var i = 0 ; i < objectives.length; i++ ){
			//	logger.info("JSON.stringify(objectives[" + i + "]) = ", JSON.stringify(objectives[i]) );
			//}

			
			//expect(objectives.length).to.be.at.least(1); 

		});
	});

});

