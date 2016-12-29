var logger = require("../app/logger");

var expect = require("chai").expect;

var Finder = require("../app/finder");
var ourFinder = new Finder();

var Common = require("./common");

describe("Finder", function(){

	describe("Add some hosts", function(){
		it("Add hosts to finder", function(){

			var hosts = Common.hosts;

			for( var i = 0; i < hosts.length; i++ ){
				logger.debug("Adding host \"" + hosts[i] + "\"...");
				ourFinder.addHost( hosts[i] );
			}

			var hostList = ourFinder.getHostNames();	
			logger.debug("hostList.length = ", hostList.length );
			logger.debug("hostList = ", hostList );
			expect(hostList.length).to.equal(hosts.length);
			//expect(hostList).to.deep.equal(hosts);
		});
	});

	describe("Add some links", function(){
		it("Add links to finder", function(){

			var links = Common.links;

			for( var i = 0; i < links.length; i++ ){
				logger.debug("Adding link: ", links[i] );
				ourFinder.addLink(links[i].host_from, links[i].description, links[i].host_to);
			}

			var listOfLinks = ourFinder.getLinks();	

			logger.debug("listOfLinks.length = ", listOfLinks.length );
			logger.debug("listOfLinks = ", listOfLinks );

			expect(listOfLinks.length).to.equal(links.length);
			//expect(listOfLinks).to.deep.equal(links);
		});
	});

	describe("Find shortest path", function(){
		it("Find shortest path", function(){

			logger.debug("getHosts() = ", ourFinder.getHosts() );
			var hosts = ourFinder.getHosts();
			for( var i = 0 ; i < hosts.length; i++ ){
				logger.debug("JSON.stringify(hosts[" + i + "]) = ", JSON.stringify(hosts[i]) );
			}


			var path_finders = Common.path_finders;


			var shortestPath;
			
			for( var i = 0; i < path_finders.length; i++ ){
				logger.debug("path_finders[" + i + "] = ", path_finders[i] );
				logger.debug("Calling findShortestPath( \"" + path_finders[i].host_from + "\", \"" + path_finders[i].host_to + "\" )...");
				shortestPath = ourFinder.findShortestPath( path_finders[i].host_from, path_finders[i].host_to );
				logger.debug("shortestPath.length from \"" + path_finders[i].host_from + "\" to \"" + path_finders[i].host_to + "\" = ", shortestPath.length );
				logger.debug("shortestPath from \"" + path_finders[i].host_from + "\" to \"" + path_finders[i].host_to + "\" = ", shortestPath );
				expect(shortestPath.length).to.equal( path_finders[i].expected_path.length );
				expect(shortestPath).to.deep.equal( path_finders[i].expected_path );
				
			}

			// Should throw "unknown host_to: 'U'"...haven't gotten chai to handle this gracefull yet...
			//expect(ourFinder.findShortestPath("T","U")).to.throw("unknown host_to: 'U'");


		});
	});

});

