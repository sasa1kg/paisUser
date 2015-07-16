angular.module('userApp').controller("accountsCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {

	console.log("Accounts!");
	scope.msg = "User accounts!";

	scope.accounts = ['njiva', 'livada', 'vocnjak', 'malinjak', 'jos nesto'];

	scope.selectedOrder = "njiva";
	scope.sensorNums = 3;
	scope.polygonsNums = 2;
	scope.polygonsSurface = 25;
	scope.records = ['IR snimanje', 'Neko snimanje'];
	scope.sensorFreq = "7 dana";
	scope.dateFrom = "";
	scope.dateTo = "";

	scope.sayHello = function (account) {
		scope.selectedOrder = account;
	};


	scope.isActive = function (order) {
    	return scope.selectedOrder === order;
  	}
}]);