angular.module('userApp').controller("loginCtrl", ["$scope", "ServerService", "$http", "$location", "$q", "$rootScope",  
	function (scope, ServerService, http, location, q, rootScope) {



	scope.expired = false;
	
	scope.init = function () {
		scope.status = (location.search()).status;
		scope.back_error = (location.search()).error;
		if (scope.status != undefined && scope.status == expired) {
			scope.expired = true;
		}
		if (scope.error != undefined && scope.error == backend) {
			scope.back_error = true;
		}
	}	
	scope.init();

	scope.tof = function () {
		var lang = rootScope.getLanguage();
		if (lang == "en") {
			window.open("/tof_en.pdf");
		} else {
			window.open("/tof_rs.pdf");
		}
	}


}]);