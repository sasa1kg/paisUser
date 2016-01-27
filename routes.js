angular.module("userApp").config(['$routeProvider', function(routeProvider) {


	routeProvider.when("/newOrder", {
		templateUrl: "partials/myNewOrder.html",
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
		templateUrl: "partials/myResults.html",
		controller: "resultsCtrl",
		resolve: {
		}
	})
	.when("/results/:order_id/", {
		templateUrl: "partials/myResults.html",
		controller: "resultsCtrl",
		resolve: {
		}
	})
	.when("/orders", {
		templateUrl: "partials/myOrders.html",
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
	.when("/sensor/:client_id/:order_id/:station_id/measurement/:id/", {
		templateUrl: "partials/mySensorReadings.html",
		controller: "sensorReadingsCtrl",
		resolve: {
		}
	})
	.when("/sensors/", {
		templateUrl: "partials/mySensorsCombined.html",
		controller: "sensorsCombinedRecordingsCtrl",
		resolve: {
		}
	})
	.when("/recording/:client_id/:order_id/:id/:polygon_id/", {
		templateUrl: "partials/myRecording.html",
		controller: "recordingCtrl",
		resolve: {
		}
	})
	.when("/recordingDg/:client_id/:order_id/:id/:polygon_id/", {
		templateUrl: "partials/myBigImageDG.html",
		controller: "bigImageCtrlDG",
		resolve: {
		}
	})
	.when("/recordingTile/:client_id/:order_id/:id/:polygon_id/:perc_x/:perc_y/", {
		templateUrl: "partials/myBigImageTile.html",
		controller: "bigImageCtrlTile",
		resolve: {
		}
	})
	.when("/testTile", {
		templateUrl: "partials/myBigImageTile.html",
		controller: "bigImageCtrlTile",
		resolve: {
		}
	})
	.when("/polygonsMap/:client_id/:order_id/", {
		templateUrl: "partials/PolygonsOnMap.html",
		controller: "polygonsMapCtrl",
		resolve: {
		}
	})
	.when("/allImages/:client_id/:order_id/", {
		templateUrl: "partials/myAllImages.html",
		controller: "myAllImagesCtrl",
		resolve: {
		}
	})
	.when("/userDetails", {
		templateUrl: "partials/myProfile.html",
		controller: "accountDetailsCtrl",
		resolve: {
		}
	})
	.when("/images/:id/", {
		templateUrl: "partials/myImages.html",
		controller: "imagesCtrl",
		resolve: {
		}
	})
	.when("/activation/:client_id/", {
		templateUrl: "partials/activateAccount.html",
		controller: "activateAccountCtrl",
		resolve: {
		}
	})
	.when("/about", {
		templateUrl: "partials/about.html"
	})
	.when("/termsOfService", {
		templateUrl: "partials/termsOfService.html"
	})
	.when("/contact", {
		templateUrl: "partials/contactUs.html",
		controller: "contactCtrl",
	})
	.when("/test", {
		templateUrl: "partials/chartsTest.html",
		controller: "chartsTestCtrl",
	})
	.when("/imagetest", {
		templateUrl: "partials/imageTest.html",
		controller: "imageTestCtrl",
	})
	.when("/imagetest2", {
		templateUrl: "partials/imageTest2.html",
		controller: "imageTest2Ctrl",
	})
	.when("/imagetest3", {
		templateUrl: "partials/imageTest3.html",
		controller: "imageTest3Ctrl",
	})
	.when("/redirection", {
		templateUrl: "partials/redirection.html",
		controller: "redirectionCtrl",
	})
	.when("/kml/:client_id/:order_id/:kml_id/", {
		templateUrl: "partials/myKML.html",
		controller: "kmlCtrl",
	})
	.otherwise({redirectTo: '/login'});

}]);