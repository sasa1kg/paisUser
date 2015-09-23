angular.module('userApp').controller("registrationCtrl", ["$scope", "$http", "$filter", "ServerService",  
	function (scope, http, filter, ServerService) {

	console.log("Register!");
	scope.msg = "Register!";

	scope.error = false;
	scope.registered = false;
	scope.backendLoadingError = false;

	scope.email = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
	scope.phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,8}$/im;


	scope.user = {
		"type_id": "",
		"username" : "",
		"email" : "",
		"password":"",
		"first_name":"",
		"last_name":"",
		"phone":"",
		"country_code": "",
        "active":0
    }

	scope.getAccountConfiguration = ServerService.getAccountTypes().then(function (data) {
 				if (data && data.length>0) {
                   console.log("Ctrl res " + JSON.stringify(data));
                   scope.user.type_id = data[0].id;
                   scope.accountTypes = data;
                } else {
                   scope.backendLoadingError = true;
                }
        }, function(reason) {
  				scope.backendLoadingError = true;
  		});
	

	scope.getCountriesConfiguration = ServerService.getCountries().then(function (data) {
 				if (data && data.length>0) {
                   console.log("Ctrl res " + data);
                   scope.countries = data;
                   scope.user.country_code = data[0].id;
                } else {
                   scope.backendLoadingError = true;
                }
        }, function(reason) {
  				scope.backendLoadingError = true;
  		});


	scope.register = function () {
		if (scope.validate()) {
			ServerService.registerUser(scope.user).then(function (data) {
				if (data) {
					scope.registered = true;
	            } else {
	                 scope.error = true;
	            }
	        }, function(reason) {
	  				scope.error = true;
	  		});
		}
	}

	scope.validate = function () {
		if (scope.user.username == undefined || scope.user.username.length < 4) {
			scope.form_error = "";
			alert("Username error");
			return false;
		}
		if (scope.user.password == undefined || scope.user.password.length < 4) {
			scope.form_error = "";
			alert("password error");
			return false;
		}
		if (scope.user.email == undefined || !scope.email.test(scope.user.email)) {
			scope.form_error = "";
			alert("email error");
			return false;
		}
		if (scope.user.first_name == undefined || scope.user.first_name.length < 2) {
			scope.form_error = "";
			alert("first_name error");
			return false;
		}
		if (scope.user.last_name == undefined || scope.user.last_name.length < 2) {
			scope.form_error = "";
			alert("last_name error");
			return false;
		}
		if (scope.user.phone == undefined || !scope.user.phone.match(scope.phoneno)) {
			scope.form_error = "";
			alert("phone error");
			return false;
		}

		return true;
	}

	scope.initialize = function () {
		
	}

	
	scope.initialize();
}]);