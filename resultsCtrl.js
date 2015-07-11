angular.module('userApp').controller("resultsCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {

	console.log("Results!");
	scope.msg = "User results!";
}]);