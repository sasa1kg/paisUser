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
					scope.username = userLS.id;
                	scope.password = userLS.password;
		} else {
					scope.username = "";
					scope.password = "";
		}

		// Intiate App credentials
		//hello.init({
		//	google : '614090791877-7b10tq78e5gi81t50i84ojgjhjhops4m.apps.googleusercontent.com',
		//},{
		//	scope : 'email',
		//	redirect_uri: "/paisUser/#/orders"
		//});
	}	
	scope.init();

	scope.login = function () {
		scope.loginFailed = true;
		ServerService.login(scope.username, scope.password).then(function (data) {
                if (data) {
                	location.path("/orders");
                } else {
                  scope.loginFailed = true;
                }
        }, function(reason) {
    		scope.loginFailed = true;
		});
		// Get Profile
		//hello('google').login().then(function() {
		//	alert('You are signed in to Google');
		//}, function(e) {
		//	alert('Signin error: ' + e.error.message);
		//});
	}

}]);