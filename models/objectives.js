var deepcopy = require('deepcopy');
//var TYPES = require('tedious-ntlm').TYPES

var jutils = require('../jutils'); // jutils.js
var sharedUtils = require('../ng/shared-utils.svc.js'); 

//var log4js = require('../lib/log4js-node/lib/log4js');
//var logger = log4js.getLogger();
var logger = require('../logger'); 

var config = require('../config'); 

//var Database = require('../Database'); // Database.js
//var Entity = require('./entity'); // use to get Entity's associated with a filing...
//var Person = require('./person'); // use to get Person' associated with a filing...
//var Company = require('./company'); // use to get Company's associated with a filing...
var MongoClient = require('mongodb').MongoClient;

function Objectives(){

	//this.database = new Database();


	// Place copy of this into outerThis as "closure" (or "private member") so you can see this as outerThis inside the callbacks...
	var outerThis = this; 

	this.getObjectives = function( options, callback ){

		var sWho = "Objectives::getObjectives";

		console.log(sWho + "(): options = " + JSON.stringify( options ) );

		if( options == null ){
			options = {};
		}

		logger.info(sWho + "(): Connecting to \"" + config.mongoDbScrummerUrl + "\"...");

		MongoClient.connect(config.mongoDbScrummerUrl, function(err, db) {

			if( err ){
				logger.error(sWho + "(): Trouble with connect: \"" + err + "\"...");
				var rows = [
					{ error: err }
				];
				callback( rows, 0, err );
				return;
			}

			logger.info(sWho + "(): Using collection \"" + config.mongoDbScrummerObjectivesCollection + "\"...");
  			var collection = db.collection( config.mongoDbScrummerObjectivesCollection );

			//var query = {};
			//var query = { "form_processing_attempts.success" : { "$eq": true } };
			//var query = { "dn_denormalized" : { "$eq": true }, "dn_company_conformed_name": { "$ne": "" } };
			var query = {};

			if( options.accessionNumber ){
				// For example the Form Details page...
				query.accession_number = { "$eq": options.accessionNumber };
			}

			if( options.accession_number_filter ){
				// MongoDB 2.4: You can also use text index...
				// see http://stackoverflow.com/questions/10610131/checking-if-a-field-contains-a-string
				// e.g., { <field>: { $regex: /pattern/, $options: '<options>' } }
				query.accession_number = { "$regex": new RegExp('.*' + options.accession_number_filter + '.*', 'i') };
			}

			if( options.form_type_filter ){

				logger.info(sWho + "(): SHEMP: Moe, found options.form_type_filter = ", options.form_type_filter , "...");

				var a_form_type_filters =[];

				if( options.form_type_filter instanceof Array ){
					a_form_type_filters = deepcopy( options.form_type_filter );	
					logger.info(sWho + "(): SHEMP: options.form_type_filter is an Array, setting a_form_type_filters to a deepcopy of it, Moe...");
				}
				else{
					a_form_type_filters = jutils.csvSplit( options.form_type_filter );	
					logger.info(sWho + "(): SHEMP: options.form_type_filter is not an Array, setting a_form_type_filters to output of csvSplit on it, Moe...");
				}

				// e.g., { qty: { $in: [ 5, 15 ] } }
				query.form_type = { "$in": a_form_type_filters };

			}/* if( options.form_type_filter ) */

			if( options.date_filed_from_filter && sharedUtils.isDateStringValid(options.date_filed_from_filter) ){
				query.date_filed = { "$gte": options.date_filed_from_filter }; 
			}

			if( options.date_filed_to_filter && sharedUtils.isDateStringValid(options.date_filed_to_filter) ){
				if( query.date_filed ){
					// query.date_filed object already exists, so set "$lte" field...
					query.date_filed["$lte"] = options.date_filed_to_filter; 
				}
				else {
					// query.date_filed object does not already exist, so create it...
					query.date_filed = { "$lte": options.date_filed_to_filter }; 
				}
			}

			if( options.filer_name_filter ){
				// e.g., { <field>: { $regex: /pattern/, $options: '<options>' } }
				query.dn_company_conformed_name = { "$regex": new RegExp('.*' + options.filer_name_filter + '.*', 'i') };
			}

			if( options.filer_cik_filter ){
				// e.g., { <field>: { $regex: /pattern/, $options: '<options>' } }
				query.dn_company_central_index_key = { "$regex": new RegExp('.*' + options.filer_cik_filter + '.*', 'i') };
			}

			logger.info(sWho + "(): query = ", query, "..."); 

			if( options.countOnly ){

				logger.info(sWho + "(): Calling collection.count()...");

  				collection.count(query, function(err, count){

					if( err ){
						logger.error(sWho + "(): Trouble with count: \"" + err + "\"...");
						var rows = [
							{ error: err }
						];
						callback( rows, 0, err );
						return;
					}

					logger.info(sWho + "(): Returning count = " + count + " to callback...");
					var rows = [
						{ "count": count }
					];
					callback( rows, count, null );  
					logger.info(sWho + "(): Calling db.close() and returning from function...");
					db.close();
					return;
				});
			}
			else {
				var iSkip;
				var iLimit;

				if( ! options.lowRow && ! options.highRow ){
					iSkip = 0;
					iLimit = 100;
				}
				else {
					// Cast them to integers to avoid hanky-panky...
					options.lowRow = parseInt(options.lowRow);
					options.highRow = parseInt(options.highRow);

					// Insanity Check...
					if(options.lowRow < 0){
						options.lowRow = 0;
					}

					// Insanity Check...
					if(options.highRow < 0){
						options.highRow = 0;
					}

					// Insanity Check: swap them if lowRow is not less than or equal to highRow
					if(options.lowRow > options.highRow){
						var temp = options.highRow;
						options.highRow = options.lowRow;
						options.lowRow = options.highRow;
					}

					iSkip = options.lowRow - 1;
					iLimit = options.highRow - options.lowRow + 1;
				}


				var sort = {};

				if( options.orderBy ){

					if( options.orderBy == "project" ){
						if( options.ascDesc == "desc" ){
							sort = {"project": -1 };
						}
						else {
							sort = {"project": 1 };
						}
					}
					else if( options.orderBy == "task_name" ){
						if( options.ascDesc == "desc" ){
							sort = {"task_name": -1 };
						}
						else {
							sort = {"task_name": 1 };
						}
					}
					else if( options.orderBy == "assigned_to" ){
						if( options.ascDesc == "desc" ){
							sort = {"assigned_to": -1 };
						}
						else {
							sort = {"assigned_to": 1 };
						}
					}
					else if( options.orderBy == "duration" ){
						if( options.ascDesc == "desc" ){
							sort = {"duration": -1 };
						}
						else {
							sort = {"duration": 1 };
						}
					}

					else if( options.orderBy == "percent_complete" ){
						if( options.ascDesc == "desc" ){
							sort = {"percent_complete": -1 };
						}
						else {
							sort = {"percent_complete": 1 };
						}
					}
					else if( options.orderBy == "start" ){
						if( options.ascDesc == "desc" ){
							sort = {"start": -1 };
						}
						else {
							sort = {"start": 1 };
						}
					}
					else if( options.orderBy == "finish" ){
						if( options.ascDesc == "desc" ){
							sort = {"finish": -1 };
						}
						else {
							sort = {"finish": 1 };
						}
					}
					else if( options.orderBy == "status" ){
						if( options.ascDesc == "desc" ){
							sort = {"status": -1 };
						}
						else {
							sort = {"status": 1 };
						}
					}
					else if( options.orderBy == "comments" ){
						if( options.ascDesc == "desc" ){
							sort = {"comments": -1 };
						}
						else {
							sort = {"comments": 1 };
						}
					}


				}/* if( options.orderBy ) */

				console.log(sWho + "(): Calling collection.find(), query = ", query, "sort = ", sort, "skip=" + iSkip + ", limit=" + iLimit + "...");

  				collection.find(query).sort(sort).skip(iSkip).limit(iLimit).toArray(function(err, items) {

					if( err ){
						logger.error(sWho + "(): Trouble with count: \"" + err + "\"...");
						var rows = [
							{ error: err }
						];
						callback( rows, 0, err );
						return;
					}

					//items = [{"qty":4, "item":"Calling Birds"},{"qty":3, "item": "French Hens"},{"qty":2, "item": "Turtle Doves"},{"qty":1, "item": "Partridge in a Pear Tree"}];

					logger.info(sWho + "(): items.length = " + items.length + "...");
					if( items.length >= 1 ){
						logger.info(sWho + "(): items[0] = ", items[0], "...");
					}

					logger.info(sWho + "(): Returning items = ",  items, " to callback...");
					//logger.info(sWho + "(): Returning items to callback...");

					callback( items, items.length, null );

					logger.info(sWho + "(): Calling db.close() and returning from function...");
					db.close();

					return;
				});

			}/* else */

		});/* MongoClient.connect(config.mongoDbUrl, function(err, db) */

	}; /* getObjectives() */

	this.getFormTypes = function( options, callback ){

		var sWho = "Form::getFormTypes";

		console.log(sWho + "(): options = " + JSON.stringify( options ) );

		if( options == null ){
			options = {};
		}

		logger.info(sWho + "(): Connecting to \"" + config.mongoDbUrl + "\"...");

		MongoClient.connect(config.mongoDbUrl, function(err, db) {

			if( err ){
				logger.error(sWho + "(): Trouble with connect: \"" + err + "\"...");
				var rows = [
					{ error: err }
				];
				callback( rows, 0, err );
				return;
			}

			logger.info(sWho + "(): Using collection \"" + config.mongoDbFormsCollection + "\"...");
  			var collection = db.collection( config.mongoDbFormsCollection );

			//var query = {};
			//var query = { "form_processing_attempts.success" : { "$eq": true } };
			//var query = { "dn_denormalized" : { "$eq": true } };
			var query = { "dn_denormalized" : { "$eq": true }, "dn_company_conformed_name": { "$ne": "" } };

			var field = "form_type";
			console.log(sWho + "(): Calling collection.distinct( \"" + field + "\", ", query, " )...");

			collection.distinct( field, query, function(err, items) {

				if( err ){
					logger.error(sWho + "(): Trouble with count: \"" + err + "\"...");
					var rows = [
						{ error: err }
					];
					callback( rows, 0, err );
					return;
				}

				logger.info(sWho + "(): items.length = " + items.length + "...");
				if( items.length >= 1 ){
					logger.info(sWho + "(): items[0] = " + items[0] + "...");
				}
				if( items.length >= 2 ){
					logger.info(sWho + "(): items[1] = " + items[1] + "...");
				}
				if( items.length >= 3 ){
					logger.info(sWho + "(): items[2] = " + items[2] + "...");
				}
				//logger.info(sWho + "(): Returning items = ",  items, " to callback...");
				logger.info(sWho + "(): Returning items to callback...");

				callback( items, items.length, null );

				logger.info(sWho + "(): Calling db.close() and returning from function...");
				db.close();
				return;

			});/* collection.distinct( field, query, function(err, items) */

		});/* MongoClient.connect(config.mongoDbUrl, function(err, db) */

	}; /* getFormTypes() */

	this.getFormsFaux = function( options, callback ){

		var sWho = "Form::getForms";

		console.log(sWho + "(): options = " + JSON.stringify( options ) );

		if( options == null ){
			options = {};
		}

		var filingErr = null;

		if( options.countOnly ){
			var filingRows = [
				{ count: "3" }
			];
			callback( filingRows, 3, filingErr );  
			return;
		}

		var filingRows = [
			{ accession_number: "1", form_type: "D", date_filed: "2016-09-18", company_name: "ACME Plumbing", company_cik: "112233" },
			{ accession_number: "2", form_type: "10-K", date_filed: "2016-09-19", company_name: "Kovacs Plumbing", company_cik: "112234" },
			{ accession_number: "3", form_type: "10-Q", date_filed: "2016-09-20", company_name: "ABC Plumbing", company_cik: "112235" },
		];
		callback( filingRows, filingRows.length, filingErr );  

	}; /* getFormsFaux() */

	

} /* function Objectives() */

module.exports = Objectives;
