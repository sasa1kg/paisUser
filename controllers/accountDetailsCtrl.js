angular.module('userApp').controller("accountDetailsCtrl", ["$rootScope", "$scope", "$http", "$filter", "ServerService",  
  function (rootScope, scope, http, filter, ServerService) {

	console.log("accountDetailsCtrl!");
	scope.msg = "accountDetailsCtrl!";

	scope.testUserId = 22;
	scope.updateSuccess = true;
	scope.updateDone = false;
  scope.retrieve = true;


	 scope.getUser =	ServerService.getClient(scope.testUserId).then(function (data) {
                if (data) {
                   console.log("Ctrl res " + data.username);
                   scope.user = data;
                } else {
                   rootScope.logout();                }
        });

	scope.updateUser = function () {
		ServerService.updateClient(scope.user).then(function (data) {
                if (data) {
                   console.log("Ctrl res " + data.username);
                   scope.updateDone = true;
                   scope.updateSuccess = true;
                   scope.user = data;
                } else {
                   scope.updateDone = true;
                   scope.updateSuccess = false;
                   alert("Data null");
                }
        }, function(reason) {
        	    scope.updateDone = true;
                scope.updateSuccess = false;
  				alert('Failed: ' + reason);
		});
	}



}]);