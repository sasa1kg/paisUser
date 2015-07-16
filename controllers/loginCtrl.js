angular.module('userApp').controller("loginCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {

	console.log("Login!");
	scope.msg = "Login!";

}]);