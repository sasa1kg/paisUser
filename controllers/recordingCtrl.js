angular.module('userApp').controller("recordingCtrl", ["$rootScope" ,"$scope", "$http", "$filter", "$routeParams", "$sce", "ServerService",  
	function (rootScope, scope, http, filter, rootParams, sce, ServerService) {


	scope.isLoading = true;
   	scope.isSuccessful = false;
    scope.percentLoaded = 0;	

    scope.client_id = rootParams.client_id;
    scope.order_id = rootParams.order_id;
    scope.polygon_id = rootParams.polygon_id;
	scope.recordingId = rootParams.id;

	scope.isCollapsed = true;

	scope.registerMe = function () {
		scope.isCollapsed = false;
	}


	scope.imageSrc = "";

	scope.loading = false;


	scope.trustSrc = function(src) {
    	return sce.trustAsResourceUrl(src);
  	}
  	scope.getImage = function () {
  		scope.loading = true;
		        ServerService.clientOrderImages(scope.client_id, scope.order_id).then(function (data) {
		                        if (data) {
		                           scope.orderImages = data;
		                           for (var i = data.length - 1; i >= 0; i--) {
			                           	if (data[i].image_id == scope.recordingId) {
			                           		scope.datatype = data[i].document_type;
			                           		scope.imageObj = data[i];
			                           	}
		                           };
		                           var userLS = ServerService.getUserInStorage();
		                            http.get('http://195.220.224.164/PaisImages/clients/'+ scope.client_id + '/orders/'+ scope.order_id + '/images/'+ scope.recordingId +'/imagefile', {
		                            	headers: {'X-Auth-Token': userLS.token},
		                            	responseType: 'arraybuffer'
		                            }).success(function (data) {
								           var file = new Blob([data], {type: scope.datatype});
								           var fileURL = URL.createObjectURL(file);
								           scope.imageSrc = fileURL;
								           scope.loading = false;
								    });
		                        } else {
		                           rootScope.errorOccured();
		      
		                        }
		                }, function(reason) {
		                        rootScope.errorOccured();
		                });
		    

    }

    scope.getImage();

    scope.newWindow = function () {
    	window.open(scope.imageSrc);
    }

}]);