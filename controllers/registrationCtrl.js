angular.module('userApp').controller("registrationCtrl", ["$rootScope", "$scope", "$http", "$filter", "ServerService",  
	function (rootScope, scope, http, filter, ServerService) {


	scope.error = false;
	scope.registered = false;
	scope.backendLoadingError = false;

	scope.email = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
	scope.phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,8}$/im;

	scope.repeatPassword = "";

	scope.errorCode = "";

	scope.user = {
		"type_id": "",
		"user_name" : "",
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
                   scope.user.type_id = data[0].id;
                   scope.accountTypes = data;
                } else {
                   scope.backendLoadingError = true;
                }
        }, function(reason) {
  				scope.backendLoadingError = true;
  		});
	
	scope.countries = [];
	scope.getCountriesConfiguration = ServerService.getCountries().then(function (data) {
 				if (data && data.length>0) {
                   for (var i = data.length - 1; i >= 0; i--) {
                   	if (data[i].active == "1") {
                   		scope.countries.push(data[i]);
                   	}
                   };
                   scope.user.country_code = scope.countries[0].id;
                } else {
                   scope.backendLoadingError = true;
                }
        }, function(reason) {
  				scope.backendLoadingError = true;
  		});

	scope.loading = false;
	scope.register = function () {
		if (scope.validate()) {
			scope.loading = true;
			ServerService.registerUser(scope.user).then(function (data) {
				if (data) {
					scope.registered = true;
					scope.loading = false;
	            } else {
	                 scope.error = true;
	                 scope.loading = false;
	            }
	        }, function(reason) {
	  				scope.error = true;
	  				scope.loading = false;
	  		});
		}
	}

	scope.validate = function () {
		scope.errorCode = "";

		if (scope.repeatPassword == undefined || (scope.user.password != scope.repeatPassword)) {
			scope.form_error = "";
			scope.errorCode = 1;
			return false;
		}
		if (scope.user.user_name == undefined || scope.user.user_name.length < 4) {
			scope.form_error = "";
			scope.errorCode = 2;
			return false;
		}
		if (scope.user.password == undefined || scope.user.password.length < 4) {
			scope.form_error = "";
			scope.errorCode = 3;
			return false;
		}
		if (scope.user.first_name == undefined || scope.user.first_name.length < 2) {
			scope.form_error = "";
			scope.errorCode = 5;
			return false;
		}
		if (scope.user.last_name == undefined || scope.user.last_name.length < 2) {
			scope.form_error = "";
			scope.errorCode = 4;
			return false;
		}
		if (scope.user.phone == undefined || !scope.user.phone.match(scope.phoneno)) {
			scope.form_error = "";
			scope.errorCode = 6;
			return false;
		}
		if (scope.user.email == undefined || scope.user.email.indexOf("@") == -1) {
			scope.errorCode = 7;
			return false;
		}


		return true;

	}
}]);