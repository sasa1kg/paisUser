angular.module('userApp').controller("bigImageCtrlTile", ["$rootScope", "$scope", "$http", "$filter", "$routeParams", "$sce", "ServerService",  
	function (rootScope, scope, http, filter, rootParams, sce, ServerService) {


	scope.isLoading = true;
   	scope.isSuccessful = false;
    scope.percentLoaded = 0;	

    scope.client_id = rootParams.client_id;
    scope.order_id = rootParams.order_id;
    scope.polygon_id = rootParams.polygon_id;
	scope.recordingId = rootParams.id;
	scope.perc_x = rootParams.perc_x;
	scope.perc_y = rootParams.perc_y;

	scope.isCollapsed = true;

	scope.registerMe = function () {
		scope.isCollapsed = false;
	}


	scope.cutLargeImageName = function (dg_name) {
      if (dg_name.indexOf("_dg") != -1) {
            var n = dg_name.indexOf("_dg");
            var res = dg_name.substring(0, n);
            return res;
      } else {
        return dg_name;
      }
    }


	scope.imageSrc = "";

	scope.loading = false;


	scope.trustSrc = function(src) {
    	return sce.trustAsResourceUrl(src);
  	}
  	scope.getImage = function () {
  		scope.perc_x = scope.perc_x / 100;
  		scope.perc_y = scope.perc_y / 100;
  		scope.perc_x  = Math.round(scope.perc_x  * 1000) / 1000;
  		scope.perc_y  = Math.round(scope.perc_y  * 1000) / 1000;
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
		                            http.get('http://195.220.224.164/PaisImages/clients/'+ scope.client_id + '/orders/'+ scope.order_id + '/polygon/' + scope.polygon_id + '/dgImage/'+ scope.recordingId +'/x/' + scope.perc_x + '/y/' + scope.perc_y + '/getTileImage', {
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