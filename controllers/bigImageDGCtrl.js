angular.module('userApp').controller("bigImageCtrlDG", ["$rootScope" ,"$scope", "$http", "$filter", "$routeParams", "$sce", "ServerService", "$modal", "$location",  
	function (rootScope, scope, http, filter, rootParams, sce, ServerService, modal, location) {


	scope.isLoading = true;
   	scope.isSuccessful = false;
    scope.percentLoaded = 0;	

    scope.client_id = rootParams.client_id;
    scope.order_id = rootParams.order_id;
    scope.polygon_id = rootParams.polygon_id;
	scope.recordingId = rootParams.id;


	scope.percX = 0;
	scope.percY = 0;

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

    scope.loadImage = function (x, y) {
      var loadModal = modal.open({
                animation: true,
                templateUrl: 'loadModal.html',
                controller: 'loadModalCtrl',
                resolve: {
                  positionObj: function() {
                      return {
                      	"percX" : x,
                      	"percY" : y,
                      	"client_id" : scope.client_id,
                      	"order_id" : scope.order_id,
                      	"polygon_id" : scope.polygon_id,
                      	"id" : scope.recordingId
                      };
                  }
              }
      });

      loadModal.result.then(function (redirect) {
      	if (redirect) {
      		var redirectionLink = "/recordingTile/" + scope.client_id + "/" + scope.order_id + "/" + scope.recordingId + "/" + scope.polygon_id + "/" + scope.percX + "/" + scope.percY + "/";
      		location.path(redirectionLink);
      	}
      });

    }

    $(document).ready(function() {
	  $("#dgPic").click(function(e) {
	  var offset = $(this).offset();
	  var relativeX = (e.pageX - offset.left) / e.target.clientWidth * 100;
	  var relativeY = (e.pageY - offset.top) / e.target.clientHeight * 100;
	  relativeX = Math.round(relativeX * 100) / 100;
	  relativeY = Math.round(relativeY * 100) / 100;
	  if (isFinite(relativeX) && isFinite(relativeY)) {
	  	scope.percX = relativeX;
	  	scope.percY = relativeY;
	  	scope.loadImage(relativeX, relativeY);
	  } 
	  $(".position").val("afaf");
	  });
	});

    scope.newWindow = function () {
    	window.open(scope.imageSrc);
    }

}]);



angular.module('userApp').controller('loadModalCtrl', function ($scope, $modalInstance, $location, $modal, ServerService, $rootScope, positionObj) {
      
      $scope.percX = positionObj.percX;
      $scope.percY = positionObj.percY;
      $scope.client_id = positionObj.client_id;
      $scope.order_id = positionObj.order_id;
      $scope.polygon_id = positionObj.polygon_id;
      $scope.id = positionObj.id;
     
      $scope.dismissModal = function () {
          $modalInstance.dismiss('cancel');
      };

      $scope.redirect = function () {
      	 $modalInstance.close(true);
      }
});