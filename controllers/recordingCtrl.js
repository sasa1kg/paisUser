angular.module('userApp').controller("recordingCtrl", ["$scope", "$http", "$filter", "$routeParams",  function (scope, http, filter, rootParams) {
	scope.activeState = 2;
	console.log("Recording Image! " + rootParams.id);
	

	scope.recordingId = rootParams.id;
	scope.isCollapsed = true;

	scope.registerMe = function () {
		scope.isCollapsed = false;
	}

}]);