angular.module("userApp").config(['$routeProvider', function(routeProvider) {

	routeProvider.when("/newOrder", {
		templateUrl: "partials/one.html",
		controller: "testCtrl",
		resolve: {
		}
	})
	.when("/login", {
		templateUrl: "partials/login.html",
		controller: "loginCtrl",
		resolve: {
		}
	})
	.when("/results", {
		templateUrl: "partials/results.html",
		controller: "resultsCtrl",
		resolve: {
		}
	})
	.when("/orders", {
		templateUrl: "partials/accounts.html",
		controller: "accountsCtrl",
		resolve: {
		}
	})
	.when("/registration", {
		templateUrl: "partials/registration.html",
		controller: "registrationCtrl",
		resolve: {
		}
	})
	.otherwise({redirectTo: '/login'});

}]);