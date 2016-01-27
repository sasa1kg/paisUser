angular.module('userApp').controller("myAllImagesCtrl", ["$scope", "$http", "$filter", "ServerService", "$routeParams", "$rootScope",  
	function (scope, http, filter, ServerService, routeParams, rootScope) {

		scope.client_id = routeParams.client_id;
		scope.order_id = routeParams.order_id;

		 scope.order = "document_created_at";

		scope.orderByName = function () {
		   scope.order = "document_name";
		}
		scope.orderByType = function () {
		   scope.order = "type";
		}
		scope.orderByDate = function () {
		   scope.order = "document_created_at";
		}
		scope.orderByType = function () {
			scope.order = "image_type";
		}

		scope.loading = false;

		scope.getImages = function () {
			scope.loading = true;
			ServerService.clientOrderImages(scope.client_id, scope.order_id).then(function (data) {
				if (data) {
					scope.orderImages = data;
					scope.loading = false;
				} else {
					scope.generalError = true;
					scope.loading = false;

				}
			}, function(reason) {
				scope.generalError = true;
				scope.loading = false;
			});
		}

	scope.getImages();



}]);