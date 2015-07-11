angular.module('userApp').controller("accountsCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {

	console.log("Accounts!");
	scope.msg = "User accounts!";

	scope.accounts = ['njiva', 'livada', 'vocnjak', 'malinjak', 'jos nesto'];


	scope.sayHello = function (account) {

		alert(account);
	};
}]);