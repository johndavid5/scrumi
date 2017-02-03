var log4js = require('./lib/log4js-node/lib/log4js');
var logger = log4js.getLogger();

// var {ObjectId} = require('mongodb'); // ObjectID Not Working...?

var ObjectID = require('mongodb').ObjectID; // use to convert string to ObjectID in mongodb

var MongoUtils = {

	debug: 0, 

	/** @reference http://stackoverflow.com/questions/21076460/how-to-convert-a-string-to-objectid-in-nodejs-mongodb-native-driver */

	safeObjectID: function(s){

		ObjectID.isValid(s) ? new ObjectID(s) : null;
	},

	
	// this other way is probably more efficient:
	//const objectIdRe = /^[0-9a-fA-F]{24}$/;
	
	safeObjectIDTwo: function(s){
		var objectIDRe = /^[0-9a-fA-F]{24}$/;

		objectIDRe.test(s) ? new ObjectID(Buffer.from(s, 'hex')) : null;
	},


	debugPrint: function( s_input ){
		if( MongoUtils.debug ){
			console.log( s_input );
		}
	},



}/* var MongoUtils = */

module.exports = MongoUtils;
