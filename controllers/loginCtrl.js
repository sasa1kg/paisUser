angular.module('userApp').controller("loginCtrl", ["$scope", "$location", "$filter", "ServerService",  function (scope, location, filter, ServerService) {

	console.log("Login!");
	scope.msg = "Login!";

	scope.username = "";
	scope.password = "";

	scope.loginFailed = false;

	scope.login = function () {
		scope.loginFailed = false;
		ServerService.login(scope.username, scope.password).then(function (data) {
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