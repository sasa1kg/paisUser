angular.module('userApp').controller("recordingCtrl", ["$scope", "$http", "$filter", "$routeParams", "$sce",  
	function (scope, http, filter, rootParams, sce) {

	console.log("Recording Image! " + rootParams.id);

	scope.isLoading = true;
   	scope.isSuccessful = false;
    scope.percentLoaded = 0;	

	scope.recordingId = rootParams.id;
	scope.isCollapsed = true;

	scope.registerMe = function () {
		scope.isCollapsed = false;
	}


	scope.src = "http://www.exosphere3d.com/pubwww/images/aspen_colorado/aspen_overhead_view.jpg";

	scope.doThis = function () {
		console.log("Finished loading");
		alert("done");
	};

	scope.trustSrc = function(src) {
    	return sce.trustAsResourceUrl(src);
  	}

}]);