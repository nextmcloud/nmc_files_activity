var nmcFilesActvityAction = (function () {
	if($(".activitysubject").length < 1){
		$("#emptycontentCustom").addClass("hidden");
	}else{
		$("#emptycontentCustom").removeClass("hidden");
	}

	var delActvities = function() {
		$('.del-files-activity').click(function(){
			alert("In del-files-activity");
			$.ajax({
				url: OC.generateUrl('/apps/nmc_files_activity/deleteActivitiesCustom'),
				type: 'DELETE'
			});
		});
	};

	// Explicitly reveal public pointers to the private functions
	// that we want to reveal publicly

	return {
		delActvities: delActvities
	}
  })();


  nmcFilesActvityAction.delActvities();
