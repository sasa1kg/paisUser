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
	.when("/sensor/:client_id/:order_id/measurement/:id/", {
		templateUrl: "partials/sensorReadings.html",
		controller: "sensorReadingsCtrl",
		resolve: {
		}
	})
	.when("/recording/:id/", {
		templateUrl: "partials/recording.html",
		controller: "recordingCtrl",
		resolve: {
		}
	})
	.when("/userDetails", {
		templateUrl: "partials/accountDetails.html",
		controller: "accountDetailsCtrl",
		resolve: {
		}
	})
	.when("/images/:id/", {
		templateUrl: "partials/images.html",
		controller: "imagesCtrl",
		resolve: {
		}
	})
	.otherwise({redirectTo: '/login'});

}]);