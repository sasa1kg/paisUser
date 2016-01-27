angular.module('userApp').controller("navigationCtrl", ["$scope", "$http", "$filter", "ServerService", "$routeParams", "$location",  
	function (scope, http, filter, ServerService, routeParams, location) {


	scope.user = ServerService.getUserInStorage();

	ServerService.getAdministratorsMails().then(function (data) {
                if (data) {
                	if (data.length > 0) {
                		scope.link = "mailto:" + data[0].email + "?Subject=Help";
                	}
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
                scope.generalError = true;
    });
	
	
}]);