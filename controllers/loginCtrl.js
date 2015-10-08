angular.module('userApp').controller("loginCtrl", ["$scope", "$location", "$filter", "ServerService",  
	function (scope, location, filter, ServerService) {

	console.log("Login!");
	scope.msg = "Login!";

	scope.username = "";
	scope.password = "";

	scope.loginFailed = false;
	
	scope.init = function () {
		var userLS = ServerService.getUserInStorage();
		if (userLS != null) {
					scope.username = userLS.username;
                	scope.password = userLS.password;
		} else {
					scope.username = "";
					scope.password = "";
		}
	}	
	scope.init();

	scope.login = function () {
		scope.loginFailed = false;
		ServerService.login({
			"username" : scope.username,
			"password" : scope.password
		}).then(function (data) {
                if (data) {
                	location.path("/orders");
                } else {
                  scope.loginFailed = true;
                }
    	}, function(reason) {
    		scope.loginFailed = true;
		});
	}

}]);