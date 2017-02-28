angular.module('waldoApp')
.controller('ObjectivesCtrl', function($scope, $interval, $window, $routeParams, ConfigSvc, ObjectivesSvc, UtilsSvc, FormTypesSvc, SharedUtilsSvc, $controller){

	var sWho = "ObjectivesCtrl";

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

	$scope.editObjective = function(objective){

		var sWho = "ObjectivesCtrl.editObjective";

		console.log(sWho + "(): SHEMP: $scope.getUser() = ", $scope.getUser(), "...");

		// SHEMP: We'd better clone it, Moe...
		$scope.theObjective = angular.copy(objective);

		console.log(sWho + "(): SHEMP: Clonin' dha objective into $scope.theObjective, Moe: objecive = ", objective, ", $scope.theObjective = ", $scope.theObjective );

		$scope.showEditObjective = true;
	}

	$scope.newObjective = function(){

		var sWho = "ObjectivesCtrl.newObjective";

		//$scope.theObjective = $scope.getBlankObjective();
		$scope.theObjective = $scope.getSampleObjective();


		$scope.showEditObjective = true;
	}

	$scope.deleteObjective = function(){

		var sWho = "ObjectivesCtrl.deleteObjective";

		if( ! $scope.getUser() ){
			$window.alert("Must be logged in to delete objective!");
			return;
		}

		if( $window.confirm("Delete objective " + $scope.theObjective.project + " - " + $scope.theObjective.task_name + "?") ){	

   			$scope.start_progress_bar();

			console.log(sWho + "(): SHEMP: Sendin' $scope.theObjective over to ObjectivesSvc.deleteObjective(), Moe, $scope.theObjective = ", $scope.theObjective );

			ObjectivesSvc.deleteObjective( $scope.theObjective )
			.success( function onDeleteObjectiveSuccess( objective ) {
				var sWho = "onDeleteObjectiveSuccess";
				console.log( sWho + "(): success, Moe: objective = ", objective );
				console.log( sWho + "(): success, Moe, let's launch \$scope.search(0 to refresh the page...");
				$scope.search();
	
			});


			$scope.showEditObjective = false;
		}


	}

	$scope.showEditObjective = false;

	$scope.openModal = function(){
		$scope.showEditObjective = true;
	};

	$scope.okEditObjective = function(){

		var sWho = "ObjectivesCtrl.okEditObjective";

		if( ! $scope.getUser() ){
			$window.alert("Must be logged in to edit or add objective!");
			return;
		}


   		$scope.start_progress_bar();

		if( $scope.theObjective._id == null ){

			console.log(sWho + "(): SHEMP: Sendin' $scope.theObjective over to ObjectivesSvc.newObjective(), Moe, $scope.theObjective = ", $scope.theObjective );

			ObjectivesSvc.newObjective( $scope.theObjective )
			.success( function onNewObjectiveSuccess( objective ) {
				var sWho = "onNewObjectiveSuccess";
				console.log( sWho + "(): success, Moe: objective = ", objective );
				console.log( sWho + "(): success, Moe, let's launch \$scope.search(0 to refresh the page...");
				$scope.search();
	
			});
		}
		else {
			console.log(sWho + "(): SHEMP: Sendin' $scope.theObjective over to ObjectivesSvc.updateObjective(), Moe, $scope.theObjective = ", $scope.theObjective );

			ObjectivesSvc.updateObjective( $scope.theObjective )
			.success( function onUpdateObjectiveSuccess( objective ) {
				var sWho = "onUpdateObjectiveSuccess";
				console.log( sWho + "(): success, Moe: objective = ", objective );
				console.log( sWho + "(): success, Moe, let's launch \$scope.search(0 to refresh the page...");
				$scope.search();
	
			});
		}

		$scope.showEditObjective = false;
	};

	$scope.cancelEditObjective = function(){
		$scope.showEditObjective = false;
	};


	/* 
	* var example = {
    *     _id": "586c4823cfe8ccc17840fda4",
    *     project": "Scrumbag",
    *     task_name": "Server Read Objectivo",
    *     assigned_to": "John",
    *     duration": "1.375 days",
    *     percent_complete": "25.6",
    *     start": "2017-01-03",
    *     finish": "2017-01-10",
    *     status": "un",
    *     comments": "Use Angular...",
    *     source_modified": "arnie"
	*	};	
	*/
	$scope.getBlankObjective = function(){
		return {
			"_id": null,
			"project": "",
			"task_name": "",
			"assigned_to": "",
			"duration": "",
			"percent_complete": "",
			"start": "",
			"finish": "",
			"status": "",
			"comments": "",
		};	
	}

	$scope.getSampleObjective = function(){
		return {
			"_id": null,
			"project": "Joe-1",
			"task_name": "Assemble Core",
			"assigned_to": "Slotin",
			"duration": "2 days",
			"percent_complete": "25.75",
			"start": "1949-08-20",
			"finish": "1949-08-22",
			"status": "In Progress",
			"comments": "Cuidado!",
		};	
	}

	$scope.debug_html = UtilsSvc.stringToBool( $routeParams.debug_html );

	$scope.entities_id_filter = $routeParams.entities_id;

	$scope.BASE_CSV_URL = SharedUtilsSvc.getUrlPrefix() + "/api/objectives?format=csv";

	$scope.csv_url = $scope.BASE_CSV_URL;

	$scope.refresh_csv_url = function(){

		var sWho = "$scope.refresh_csv_url";

		$scope.csv_url = $scope.BASE_CSV_URL 
		+ "&project_filter=" + $scope.project_filter
		+ "&task_filter=" + $scope.task_filter
		+ "&start_date_from_filter=" + $scope.start_date_from_filter
		+ "&finish_date_to_filter=" + $scope.finish_date_to_filter
		+ "&finish_date_from_filter=" + $scope.finish_date_from_filter
		+ "&start_date_to_filter=" + $scope.start_date_to_filter
		+ "&filer_name_filter=" + $scope.filer_name_filter
		+ "&filer_cik_filter=" + $scope.filer_cik_filter
		+ "&orderBy=" + $scope.current_sort_by 
		+ "&ascDesc=" + $scope.current_asc_desc;

		console.log(sWho + "(): $scope.csv_url = \"" + $scope.csv_url + "\"...");	
	}; /* $scope.refresh_csv_url() */

	// Later use stylesheets for this mouseover...better yet, make a fake button that displays the basic gif...
	$scope.MOUSE_OUT_CSV_BTN_IMG_SRC = ConfigSvc.MOUSE_OUT_CSV_BTN_IMG_SRC;
	$scope.MOUSE_OVER_CSV_BTN_IMG_SRC = ConfigSvc.MOUSE_OVER_CSV_BTN_IMG_SRC;

	$scope.csv_btn_img_src = $scope.MOUSE_OUT_CSV_BTN_IMG_SRC;

	$scope.ARROW_UP_GRAY_BTN_IMG_SRC = ConfigSvc.ARROW_UP_GRAY_BTN_IMG_SRC;
	$scope.ARROW_UP_WHITE_BTN_IMG_SRC = ConfigSvc.ARROW_UP_WHITE_BTN_IMG_SRC;

	$scope.ARROW_DOWN_GRAY_BTN_IMG_SRC = ConfigSvc.ARROW_DOWN_GRAY_BTN_IMG_SRC;
	$scope.ARROW_DOWN_WHITE_BTN_IMG_SRC = ConfigSvc.ARROW_DOWN_WHITE_BTN_IMG_SRC;

	$scope.ARROW_TRANSPARENT_BTN_IMG_SRC = ConfigSvc.ARROW_TRANSPARENT_BTN_IMG_SRC;
			
	$scope.start_date_from_filter = "";
	//$scope.start_date_from_filter = SharedUtilsSvc.firstDayOfThisMonthAsString();
	//$scope.start_date_from_filter = "2015-07-01"; // Hard code to July 1st, 2015 for now...perhaps use a more sophisticated algorithm later...

	$scope.finish_date_from_filter = "";

	$scope.edgarFileNameToEdgarSecFilingPageUrl = SharedUtilsSvc.edgarFileNameToEdgarSecFilingPageUrl;

	$scope.on_mouse_enter_csv_btn = function(){
		var sWho = "$scope.on_mouse_enter_csv_btn";
		//console.log(sWho + "()...");
		//console.log(sWho + "(): BEFORE: $scope.csv_btn_img_src = \"" + $scope.csv_btn_img_src + "\"...");
		$scope.csv_btn_img_src = $scope.MOUSE_OVER_CSV_BTN_IMG_SRC;
		//console.log(sWho + "(): AFTER: $scope.csv_btn_img_src = \"" + $scope.csv_btn_img_src + "\"...");
	};

	$scope.on_mouse_leave_csv_btn = function(){
		var sWho = "$scope.on_mouse_leave_csv_btn";
		//console.log(sWho + "()...");
		//console.log(sWho + "(): BEFORE: $scope.csv_btn_img_src = \"" + $scope.csv_btn_img_src + "\"...");
		$scope.csv_btn_img_src = $scope.MOUSE_OUT_CSV_BTN_IMG_SRC;
		//console.log(sWho + "(): BEFORE: $scope.csv_btn_img_src = \"" + $scope.csv_btn_img_src + "\"...");
	};

	$scope.columns = [
			{"heading": "Project", "name": "project", "width": "12%"},
			{"heading": "Task", "name": "task_name", "width": "11%"},
			{"heading": "Assigned To", "name": "assigned_to", "width": "11%" },
			{"heading": "Duration", "name": "duration", "width": "11%"},
			{"heading": "% Complete", "name": "percent_complete", "width": "11%"},
			{"heading": "Start", "name": "start", "width": "11%"},
			{"heading": "Finish", "name": "finish", "width": "11%"},
			{"heading": "Status", "name": "status", "width": "11%"},
			{"heading": "Comments", "name": "comments", "width": "11%"},
	];

	$scope.total_entries = 0;

	$scope.DEFAULT_ENTRIES_PER_PAGE = 100;

	$scope.entries_per_page = $scope.DEFAULT_ENTRIES_PER_PAGE;
	$scope.requested_entries_per_page = 100;

	$scope.current_page_num = 1;
	$scope.requested_page_num = 1;
	$scope.pending_page_num = 1;

	$scope.total_num_pages = 0;
	//$scope.max_pagination_pages = 7;
	//$scope.max_pagination_pages = 8;
	//$scope.max_pagination_pages = 9;
	$scope.max_pagination_pages = 10;
	$scope.pagination_pages_array = [];

	$scope.filter_text_array = [];

	$scope.pending_sort_by = "date_filed";
	$scope.pending_asc_desc = "desc";

	$scope.current_sort_by = "";
	$scope.current_asc_desc = "";

	$scope.current_mouse_on = "";

	$scope.project_filter = "";

	$scope.task_filter = "";

	$scope.filer_name_filter = "";
	$scope.filer_cik_filter = "";
	

	// Private variable for "Jane, stop this crazy thing...!"
	var progress_interval_handle;
	var progress_reversing = false;

	var progress_start = 50;
	var progress_increment = 25;
	var progress_max = 100;

	$scope.progress_bar_active = false;

	//$scope.progress_bar_style = "circular";
	$scope.progress_bar_style = "back-and-forth";

	$scope.progress = 0;

	$scope.start_progress_bar = function( bManualAdvance ){

		// Don't start a new progress bar if we are already progressing...
		if ( angular.isDefined(progress_interval_handle) ){
				return;
		}

		$scope.progress_bar_active = true;
		$scope.progress = progress_start;

		if( ! bManualAdvance ){
			progress_interval_handle = $interval( function() {
				$scope.advance_progress_bar();
   		      }, 100 
			);
		}
	};



	$scope.advance_progress_bar = function(){

		var sWho = sWho + "::advance_progress_bar";

		if( $scope.progress_bar_style == "circular" ){

			//console.log(sWho + "(): BEFORE: $scope.progress = ", $scope.progress );

			var nextel = $scope.progress + progress_increment;

			if( nextel > progress_max ){
				nextel = 0;
			}

			$scope.progress = nextel;
	
			//console.log(sWho + "(): AFTER: $scope.progress = ", $scope.progress );

		}
		else {
			//console.log(sWho + "(): BEFORE: progress_reversing = ", progress_reversing, ", $scope.progress = ", $scope.progress );
	
			if( progress_reversing ){	
				$scope.progress -= progress_increment;
			}
			else {
				$scope.progress += progress_increment;
			}
	
			if($scope.progress >= progress_max) {
				progress_reversing = true;
			} else if ($scope.progress <= 0) {
				progress_reversing = false;
			}
	
			//console.log(sWho + "(): AFTER: progress_reversing = ", progress_reversing, ", $scope.progress = ", $scope.progress );
		}
	};

	$scope.stop_progress_bar = function(){
		if (angular.isDefined(progress_interval_handle)) {
			$interval.cancel(progress_interval_handle);
            progress_interval_handle = undefined;

			$scope.progress = 0;
			$scope.progress_bar_active = false;
		}
	};

	$scope.$on('$destroy', function() {
		// Make sure that the interval is destroyed too
		$scope.stop_progress_bar();
	});



	$scope.massage_and_validate_search_filters = function( filterOptions ){

		$scope.project_filter = UtilsSvc.isNull(  $scope.project_filter, "" );

		$scope.task_filter = UtilsSvc.isNull(  $scope.task_filter, "" );

		filterOptions.project_filter = $scope.project_filter;
		filterOptions.task_filter = $scope.task_filter;

		var outOptions = {};

		if( $scope.foolishly_attempt_to_use_angular_date_picker ){
			$scope.start_date_from_filter = SharedUtilsSvc.formatDateObjectAsString( $scope.start_date_from_filter_dt );

			$scope.finish_date_from_filter = SharedUtilsSvc.formatDateObjectAsString( $scope.finish_date_from_filter_dt );
		}
		else {
			//$scope.start_date_from_filter = UtilsSvc.isNull(  $scope.start_date_from_filter, "" );

			if( ! $scope.start_date_from_filter ){
				$scope.start_date_from_filter = "";
			}
			$scope.start_date_from_filter = $scope.start_date_from_filter.trim();

			if( $scope.start_date_from_filter.length != 0 ){
		
				if( ! SharedUtilsSvc.isDateStringValid( $scope.start_date_from_filter, outOptions ) ){
					$window.alert("Date Filed From = '" + $scope.start_date_from_filter + "' is not a valid date.");
					return false;
				}
				$scope.start_date_from_filter = outOptions.formattedDateStringOut;
				$scope.start_date_from_filter_dt = outOptions.dateObjectOut;
			}

			if( ! $scope.finish_date_from_filter ){
				$scope.finish_date_from_filter = "";
			}
			$scope.finish_date_from_filter = $scope.finish_date_from_filter.trim();

			if( $scope.finish_date_from_filter.length != 0 ){
		
				if( ! SharedUtilsSvc.isDateStringValid( $scope.finish_date_from_filter, outOptions ) ){
					$window.alert("Date Filed From = '" + $scope.finish_date_from_filter + "' is not a valid date.");
					return false;
				}
				$scope.finish_date_from_filter = outOptions.formattedDateStringOut;
				$scope.finish_date_from_filter_dt = outOptions.dateObjectOut;
			}
		}
		

		/***********************************************************************/

		if( $scope.foolishly_attempt_to_use_angular_date_picker ){
			$scope.start_date_to_filter = SharedUtilsSvc.formatDateObjectAsString( $scope.start_date_to_filter_dt );

			$scope.finish_date_to_filter = SharedUtilsSvc.formatDateObjectAsString( $scope.finish_date_to_filter_dt );
		}
		else {
			//$scope.start_date_to_filter = UtilsSvc.isNull(  $scope.start_date_to_filter, "" );
		
			if( ! $scope.start_date_to_filter ){
				$scope.start_date_to_filter = "";
			}
			$scope.start_date_to_filter = $scope.start_date_to_filter.trim();
	
			if( $scope.start_date_to_filter.length != 0 ){
				if( ! SharedUtilsSvc.isDateStringValid( $scope.start_date_to_filter, outOptions ) ){
					$window.alert("Date Filed To = '" + $scope.start_date_to_filter + "' is not a valid date.");
					return false;
				}
				$scope.start_date_to_filter = outOptions.formattedDateStringOut;
				$scope.start_date_to_filter_dt = outOptions.dateObjectOut;
			}

			if( ! $scope.finish_date_to_filter ){
				$scope.finish_date_to_filter = "";
			}
			$scope.finish_date_to_filter = $scope.finish_date_to_filter.trim();
	
			if( $scope.finish_date_to_filter.length != 0 ){
				if( ! SharedUtilsSvc.isDateStringValid( $scope.finish_date_to_filter, outOptions ) ){
					$window.alert("Date Filed To = '" + $scope.finish_date_to_filter + "' is not a valid date.");
					return false;
				}
				$scope.finish_date_to_filter = outOptions.formattedDateStringOut;
				$scope.finish_date_to_filter_dt = outOptions.dateObjectOut;
			}
		}

		console.log( sWho + "(): SHEMP: Before, Moe: $scope.start_date_from_filter_dt = ", $scope.start_date_from_filter_dt );
		console.log( sWho + "(): SHEMP: Before, Moe: $scope.start_date_to_filter_dt = ", $scope.start_date_to_filter_dt );

		console.log( sWho + "(): SHEMP: Before, Moe: $scope.start_date_from_filter = ", $scope.start_date_from_filter );
		console.log( sWho + "(): SHEMP: Before, Moe: $scope.start_date_to_filter = ", $scope.start_date_to_filter );

		console.log( sWho + "(): SHEMP: Before, Moe: $scope.finish_date_from_filter_dt = ", $scope.finish_date_from_filter_dt );
		console.log( sWho + "(): SHEMP: Before, Moe: $scope.finish_date_to_filter_dt = ", $scope.finish_date_to_filter_dt );

		console.log( sWho + "(): SHEMP: Before, Moe: $scope.finish_date_from_filter = ", $scope.finish_date_from_filter );
		console.log( sWho + "(): SHEMP: Before, Moe: $scope.finish_date_to_filter = ", $scope.finish_date_to_filter );

		if( $scope.start_date_from_filter_dt instanceof Date 
			&& $scope.start_date_to_filter_dt instanceof Date 
			&& $scope.start_date_from_filter_dt.getTime() >  $scope.start_date_to_filter_dt.getTime() )
		{
			console.log( sWho + "(): SHEMP: Sorry, Moe, looks like start_date_from_filter_dt is greater than start_date_to_filter_dt, I'm gonna have to swap 'em, Moe...");

			var le_swapperou;

			le_swapperou = $scope.start_date_to_filter_dt;
			$scope.start_date_to_filter_dt = $scope.start_date_from_filter_dt;
			$scope.start_date_from_filter_dt = le_swapperou;

			le_swapperou = $scope.start_date_to_filter;
			$scope.start_date_to_filter = $scope.start_date_from_filter;
			$scope.start_date_from_filter = le_swapperou;
		}

		if( $scope.finish_date_from_filter_dt instanceof Date 
			&& $scope.finish_date_to_filter_dt instanceof Date 
			&& $scope.finish_date_from_filter_dt.getTime() >  $scope.finish_date_to_filter_dt.getTime() )
		{
			console.log( sWho + "(): SHEMP: Sorry, Moe, looks like finish_date_from_filter_dt is greater than finish_date_to_filter_dt, I'm gonna have to swap 'em, Moe...");

			var le_swapperou;

			le_swapperou = $scope.finish_date_to_filter_dt;
			$scope.finish_date_to_filter_dt = $scope.finish_date_from_filter_dt;
			$scope.finish_date_from_filter_dt = le_swapperou;

			le_swapperou = $scope.finish_date_to_filter;
			$scope.finish_date_to_filter = $scope.finish_date_from_filter;
			$scope.finish_date_from_filter = le_swapperou;
		}

		console.log( sWho + "(): SHEMP: After, Moe: $scope.start_date_from_filter_dt = ", $scope.start_date_from_filter_dt );
		console.log( sWho + "(): SHEMP: After, Moe: $scope.start_date_to_filter_dt = ", $scope.start_date_to_filter_dt );

		console.log( sWho + "(): SHEMP: After, Moe: $scope.start_date_from_filter = ", $scope.start_date_from_filter );
		console.log( sWho + "(): SHEMP: After, Moe: $scope.start_date_to_filter = ", $scope.start_date_to_filter );

		console.log( sWho + "(): SHEMP: After, Moe: $scope.finish_date_from_filter_dt = ", $scope.finish_date_from_filter_dt );
		console.log( sWho + "(): SHEMP: After, Moe: $scope.finish_date_to_filter_dt = ", $scope.finish_date_to_filter_dt );

		console.log( sWho + "(): SHEMP: After, Moe: $scope.finish_date_from_filter = ", $scope.finish_date_from_filter );
		console.log( sWho + "(): SHEMP: After, Moe: $scope.finish_date_to_filter = ", $scope.finish_date_to_filter );


		filterOptions.start_date_from_filter = $scope.start_date_from_filter;
		filterOptions.start_date_to_filter = $scope.start_date_to_filter;

		filterOptions.finish_date_from_filter = $scope.finish_date_from_filter;
		filterOptions.finish_date_to_filter = $scope.finish_date_to_filter;

		//filterOptions.filing_agent_entity_name_varchar_filter = $scope.filing_agent_entity_name_varchar_filter;
		//filterOptions.filing_agent_cik_bigint_filter = $scope.filing_agent_cik_bigint_filter;
		filterOptions.filer_name_filter = $scope.filer_name_filter;
		filterOptions.filer_cik_filter = $scope.filer_cik_filter;

		filterOptions.entities_id_filter = $scope.entities_id_filter;

		return true;

	};/* $scope.massage_and_validate_search_filters() */

	$scope.requested_page_num_press = function( which, $event ){
		var sWho = "requested_page_num_press";
		console.log( sWho + "(): which = \"" + which + "\", \$event = ", $event , "...");
		console.log( sWho + "(): \$event.char = \"" + $event.char + "\", \$event.charCode=\"" + $event.charCode + "\"...");
		if( event.charCode == 13 ){
			// Looks like they hit the enter key...
			//$scope.go_to_page( which );
			$scope.search();
		}
	};

	$scope.requested_entries_per_page_press = function( which, $event ){
		var sWho = "requested_entries_per_page_press";
		console.log( sWho + "(): which = \"" + which + "\", \$event = ", $event , "...");
		console.log( sWho + "(): \$event.char = \"" + $event.char + "\", \$event.charCode=\"" + $event.charCode + "\"...");
		if( event.charCode == 13 ){
			// Looks like they hit the enter key...
			//$scope.go_to_page( which );
			$scope.search();
		}
	};

	$scope.go_to_page = function( which, $event ){

		var sWho = "go_to_page";

		console.log( sWho + "(): which = \"" + which + "\", \$event = ", $event , "...");

		var pending_page_num;

		if( which == "first" ){
			pending_page_num = 1;
		}
		else if( which == "previous" ){
			pending_page_num = $scope.current_page_num-1;
		}
		else if( which == "next" ){
			pending_page_num = $scope.current_page_num+1;
		}
		else if( which == "last" ){
			pending_page_num = $scope.total_num_pages;
		}
		else {
			// Assume it's a page number...later, validate that it's numeric...
			pending_page_num = which;
		}

		if( pending_page_num <= 1 ){	
			pending_page_num = 1;
		}
		else if( pending_page_num >= $scope.total_num_pages ){	
			pending_page_num = $scope.total_num_pages;
		}

		$scope.requested_page_num = pending_page_num;

		$scope.search();

	}; /* $scope.go_to_page() */

	$scope.get_pagination_class_for = function(what){
		if( what == "previous" || what == "first" ){
			if( $scope.current_page_num <= 1 ){
				return "disabled";
			}
			else {
				return "";
			}
		}
		else if( what == "next" || what == "last" ){
			if( $scope.current_page_num >= $scope.total_num_pages ){
				return "disabled";
			}
			else {
				return "";
			}
		}
		else {
			// Assume it's a page number...
			if( what == $scope.current_page_num ){
				return "active";
			}
			else if( what == $scope.pending_page_num ){
				return "pending";
			}
			else {
				return "";
			}
		}
	}; /* $scope.get_pagination_class_for */

	/* Returns the array used to display the paginator...
	*  e.g., "1", "2", "3", "4", "5"
	*  or    "6", "7", "8", "9", "10"
	*/
	$scope.get_pagination_pages_array = function(){

		var sWho = "$scope.get_pagination_pages_array";


		console.log(sWho + "(): $scope.max_pagination_pages = ", $scope.max_pagination_pages, "...");
		console.log(sWho + "(): $scope.pending_page_num = ", $scope.pending_page_num, "...");
		console.log(sWho + "(): $scope.total_num_pages = ", $scope.total_num_pages, "...");

		return UtilsSvc.get_pagination_pages_array( $scope.max_pagination_pages, $scope.pending_page_num, $scope.total_num_pages );

	}; /* $scope.get_pagination_pages_array() */

	$scope.insanity_filter_entries_per_page = function( entries_per_page ){
		if( ! SharedUtilsSvc.isIntegerValid( entries_per_page ) ){
			return $scope.DEFAULT_ENTRIES_PER_PAGE
		}
		else if( entries_per_page <= 0 ){
			return $scope.DEFAULT_ENTRIES_PER_PAGE
		}
		else if( entries_per_page > ConfigSvc.MAX_ENTRIES_PER_PAGE ){
			return ConfigSvc.MAX_ENTRIES_PER_PAGE;
		}
		else{
			return entries_per_page;
		}
	}

	$scope.insanity_filter_requested_page_num = function( page_num ){
		if( ! SharedUtilsSvc.isIntegerValid( page_num ) ){
			return 1;
		}
		else if( page_num <= 0 ){
			return 1;
		}
		else{
			return page_num;
		}
	}

	/* Use this as the single "load" point 
    * for "Search", "Sort" and "Paginate"...
	*/
	$scope.search = function($event){

		var sWho = "search";

		console.log( sWho + "()...");

		if( $event ){
			$event.preventDefault();
			$event.stopPropagation();
		}

		//var options = {"maxRows": 100, "withFilingsAttributesOnly": true };
		var options = {};

		if( ! $scope.massage_and_validate_search_filters( options ) ){
			return;
		}

		$scope.requested_entries_per_page = $scope.insanity_filter_entries_per_page( $scope.requested_entries_per_page );
		$scope.pending_entries_per_page = $scope.requested_entries_per_page;

		$scope.requested_page_num = $scope.insanity_filter_requested_page_num( $scope.requested_page_num );
		$scope.pending_page_num = $scope.requested_page_num;

		// Don't forget your sort options...
		options.orderBy = $scope.pending_sort_by;
		options.ascDesc = $scope.pending_asc_desc;

   		$scope.start_progress_bar();

		// Later on, adjust logic so we only re-fetch the count if the search filters have changed...
		ObjectivesSvc.fetch_count( options )
		.success(function(arrayOut){

			console.log( sWho + "(): Got back arrayOut = ", arrayOut, "..." );

			// Expecting something like arrayOut = [{"count":970}]...array of one element... 
			if( arrayOut instanceof Array ){
				if( arrayOut.length != 0 ){
					$scope.total_entries = arrayOut[0].count;
					console.log( sWho + "(): Just set \$scope.total_entries = ", $scope.total_entries, ", Escamillo...");

					//$scope.total_num_pages = SharedUtilsSvc.getNumPages( $scope.total_entries, $scope.entries_per_page );
					$scope.total_num_pages = SharedUtilsSvc.getNumPages( $scope.total_entries, $scope.pending_entries_per_page );
					console.log( sWho + "(): Just set \$scope.total_num_pages = ", $scope.total_num_pages, ", Escamillo...");

					// Total number of pages may have changed, adjust $scope.pending_page_num if it's > $scope.total_num_pages...
					if( $scope.pending_page_num > $scope.total_num_pages ){
						console.log( sWho + "(): Sorry, Moe, we need to adjust too-high \$scope.pending_page_num: BEFORE: ", $scope.pending_page_num, "...");
						$scope.pending_page_num = $scope.total_num_pages;
						console.log( sWho + "(): Sorry, Moe, we need to adjust too-high \$scope.pending_page_num: AFTER: ", $scope.pending_page_num, "...");
					}

					$scope.pagination_pages_array = $scope.get_pagination_pages_array();
				}
				else {
					console.log( sWho + "(): WARNING: arrayOut is an Array, but its length is zero...");
				}
			}
			else {
				console.log( sWho + "(): WARNING: arrayOut is not an Array, expected an Array...");
			}

			
			var rangeOutOptions = {};
			//SharedUtilsSvc.getRangesForPage( $scope.total_entries, $scope.entries_per_page, $scope.pending_page_num, rangeOutOptions ); 
			SharedUtilsSvc.getRangesForPage( $scope.total_entries, $scope.pending_entries_per_page, $scope.pending_page_num, rangeOutOptions ); 
			console.log( sWho + "(): SharedUtilSvc.getRangesForPage( totalEntries = ", $scope.total_entries , ", entriesPerPage = ", $scope.pending_entries_per_page, ", pageNumber = ", $scope.pending_page_num, " ) yielded rangeOutOptions = ", rangeOutOptions, "...");

			options.lowRow = rangeOutOptions.lowEntryOut;
			options.highRow = rangeOutOptions.highEntryOut;
			//options.rowOffset = rangeOutOptions.offsetOut;
			//options.rowLimit = rangeOutOptions.limitOut;

   			ObjectivesSvc.fetch( options )
			.success(function(objectives){

				console.log( sWho + "(): Got back objectives...");

				if( objectives instanceof Array ){
					console.log( sWho + "(): objectives is an Array with filings.length = " + objectives.length );
				}
				else {
					console.log( sWho + "(): WARN: objectives is NOT an Array, we expected an Array...");
				}

				$scope.filter_text_array = $scope.create_filter_text_array( options ); 

				$scope.entries_per_page = $scope.pending_entries_per_page;
				$scope.requested_entries_per_page = $scope.entries_per_page;

				$scope.current_page_num = $scope.pending_page_num;
				$scope.requested_page_num = $scope.current_page_num;

				$scope.current_sort_by = $scope.pending_sort_by;
				$scope.current_asc_desc = $scope.pending_asc_desc;

				$scope.objectives = objectives;

				navStickyTableHeaderInit(); // in nav.js	

	   			$scope.stop_progress_bar();

			});
		});

	}; /* search() */

	$scope.create_filter_text_array = function( options ){

		var sWho = "create_filter_text_array";

		var aOutput = [];

		console.log( sWho + "(): options = ", options );

		if( options.project_filter ){
			aOutput.push("Project:\"*" + options.project_filter + "*\""); 	
		}

		if( options.task_filter ){
			aOutput.push("Task: \"" + options.task_filter + "\""); 	
		}

		if( options.start_date_from_filter ){
			aOutput.push("Start Date From: \"" + options.start_date_from_filter + "\""); 	
		}

		if( options.start_date_to_filter ){
			aOutput.push("Start Date To: \"" + options.start_date_to_filter + "\""); 	
		}

		if( options.finish_date_from_filter ){
			aOutput.push("Finish Date From: \"" + options.finish_date_from_filter + "\""); 	
		}

		if( options.finish_date_to_filter ){
			aOutput.push("Finish Date To: \"" + options.finish_date_to_filter + "\""); 	
		}

		//if( options.filing_agent_entity_name_varchar_filter ){
		//	aOutput.push("Filing Agent: \"*" + options.filing_agent_entity_name_varchar_filter + "*\""); 	
		//}
		
		//if( options.filer_name_filter ){
		//	aOutput.push("Filer Name: \"*" + options.filer_name_filter + "*\""); 	
		//}

		//if( options.start_date_from_filter ){
		//	aOutput.push("Date Filed From: \"" + options.start_date_from_filter + "\""); 	
		//}

		//if( options.start_date_to_filter ){
		//	aOutput.push("Date Filed To: \"" + options.start_date_to_filter + "\""); 	
		//}

		//if( options.filer_cik_filter ){
		//	aOutput.push("Filer CIK: \"*" + options.filer_cik_filter + "*\""); 	
		//}

		//if( options.entities_id_filter ){
		//	aOutput.push("Entities ID: \"" + options.entities_id_filter + "\""); 	
		//}

		console.log( sWho + "(): aOutput = ", aOutput, "...");

		return aOutput;

		//var sOut = aOutput.join(", ");
		//
		//var sOut = "";
		//for( var i = 0; i < aOutput.length; i++ ){
		//	if( i > 0 ){
		//		sOut += ", ";
		//	}
		//
		//	sOut +="<span style=\"white-space: nowrap;\">" + aOutput[i] + "</span>"; 
		//}
		//console.log( sWho + "(): Returning sOut = \"" + sOut + "\"...");
		//return sOut;

	}/* create_filter_text_array() */


	$scope.sortBy = function( sColumnName ){
		var sWho = "sortBy";

		console.log( sWho + "(): sColumnName = '" + sColumnName + "'...");

		console.log( sWho + "(): Hey, Moe: \$scope.current_sort_by = '" + $scope.current_sort_by + "'...");
		console.log( sWho + "(): Hey, Moe: \$scope.current_asc_desc = '" + $scope.current_asc_desc + "'...");

		if( $scope.current_sort_by == sColumnName ){
			// Same column as last sort, so flip asc_desc...
			$scope.pending_asc_desc = $scope.flip_asc_desc( $scope.current_asc_desc );
			$scope.pending_sort_by = $scope.current_sort_by;
		}
		else {
			// Different column from last sort, so set to asc_desc to "asc"
			$scope.pending_asc_desc = "asc"
			$scope.pending_sort_by = sColumnName;
		}

		$scope.search();

	};/* $scope.sortBy() */


	$scope.flip_asc_desc = function( sAscDesc ){
		if( sAscDesc == "asc" ){
			return "desc";
		}
		else if( sAscDesc == "desc" ){
			return "asc";
		}
		else {
			return "???";
		}
	};



	$scope.on_mouse_enter_col = function( sColumnName ){
		$scope.current_mouse_on = sColumnName;
	};

	$scope.on_mouse_leave_col = function( sColumnName ){
		$scope.current_mouse_on = "";
	};

	$scope.get_arrow_img_src = function( sColumnName ){
		if( $scope.current_sort_by == sColumnName ){
			if( $scope.current_asc_desc == "asc" ){
				if( $scope.current_mouse_on == sColumnName ){
					return $scope.ARROW_UP_GRAY_BTN_IMG_SRC;
					//return "/images/arrow_up.40x34.gray.gif";
				}
				else {
					return $scope.ARROW_UP_WHITE_BTN_IMG_SRC;
					//return "/images/arrow_up.40x34.white.gif";
				}
			}
			else {
				if( $scope.current_mouse_on == sColumnName ){
					return $scope.ARROW_DOWN_GRAY_BTN_IMG_SRC;
					//return "/images/arrow_down.40x34.gray.gif";
				}
				else {
					return $scope.ARROW_DOWN_WHITE_BTN_IMG_SRC;
					//return "/images/arrow_down.40x34.white.gif";
				}
			}
		}
		else {
			//return "/images/transparent.40x34.gif";
			return $scope.ARROW_TRANSPARENT_BTN_IMG_SRC;
		}
	};

	$scope.get_asc_desc_class_for_column = function( sColumnName ){
		if( $scope.current_sort_by == sColumnName ){
			return current_asc_desc;
		}
		else {
			return "transparent";
		}
	};

	$scope.get_asc_for_column = function( sColumnName ){
		if( sColumnName == $scope.current_sort_by ){	
			return $scope.current_asc_desc;		
		}
		else {
			return "";
		}
	};

	// <DATE_PICKER_SHTUFF>

	// Disable weekend selection for datepicker...
	$scope.is_date_disabled = function(date, mode) {
		//return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		return false;
	};

	$scope.open_close_date_picker = function($event, which) {

		$event.preventDefault();
		$event.stopPropagation();

		$scope['date_filter_'+which+'_opened'] = ! $scope['date_filter_'+which+'_opened']; 

		//if( $("#" + which + ).datepicker( "widget" ).is(":visible") ){
		//	$("#" + which + ).datepicker('hide');
		//}
		//else {
		//	$("#" + which + ).datepicker('show');
		//}
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 0, // Sunday
		showWeeks: false, // Show week number...
	};

	$scope.date_format = 'yyyy-MM-dd';


//	$scope.$watch( 'start_date_from_filter_dt',
//		function(value){
//			console.log("GEORGE TAKEI: Oh, my..., start_date_from_filter_dt has changed...");
//			$scope.synch_date_filed_filter_to_dt();
//		}
//	);
//
//	$scope.$watch( 'start_date_to_filter_dt',
//		function(value){
//			console.log("GEORGE TAKEI: Oh, my..., start_date_to_filter_dt has changed...");
//			$scope.synch_date_filed_filter_to_dt();
//		}
//	);


		if( ConfigSvc.AUTO_SEARCH ){
			// Perform an initial automatic fetcheroo...or maybe 
			// don't do this and wait for the user to click on
			// something...?
			$scope.search();
		}


});

