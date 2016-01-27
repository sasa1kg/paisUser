angular.module('userApp').controller("activateAccountCtrl", ["$scope", "$http", "$filter", "ServerService", "$routeParams",  
	function (scope, http, filter, ServerService, routeParams) {

		scope.param_client_id = routeParams.client_id;

		scope.activated = false;
		scope.generalError = false;



		ServerService.activateAccount(scope.param_client_id).then(function (data) {
			if (data) {
				scope.activated = true;
			} else {
				scope.generalError = true;
			}
		}, function(reason) {
			scope.generalError = true;
		});
		
		
		
	}]);