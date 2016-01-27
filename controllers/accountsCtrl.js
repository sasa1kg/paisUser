angular.module('userApp').controller("accountsCtrl", ["$rootScope", "$scope", "$http", "$filter", "ServerService", "$location",  
	function (rootScope, scope, http, filter, ServerService, location) {

	scope.selectedAccount = "";
	scope.accounts = [];
	scope.loaded = false;
	scope.imagesPanelOpen = true;


    scope.toogleImagesPanel = function () {
        scope.imagesPanelOpen = !scope.imagesPanelOpen;
    }



	scope.sensorsCalculation = function () {
		scope.nonActiveSensors = 0;
		scope.activeSensors = 0;
		for (var i = scope.selectedAccount.stations.length - 1; i >= 0; i--) {
			for (var j = scope.selectedAccount.stations[i].sensors.length - 1; j >= 0; j--) {
				if (scope.selectedAccount.stations[i].sensors[j].active == 0) {
					scope.nonActiveSensors = scope.nonActiveSensors + 1;
				} else {
					scope.activeSensors = scope.activeSensors + 1;
				}
			}
		};
	}

	scope.getTotalSurface = function () {
		scope.totalSurface = 0;
		for (var i = scope.selectedAccount.polygons.length - 1; i >= 0; i--) {
			scope.totalSurface = scope.totalSurface + scope.selectedAccount.polygons[i].surface;
		};
	}

	scope.getOrderFrequencies = function () {
		for (var i = scope.frequencies.length - 1; i >= 0; i--) {
			if (scope.frequencies[i].id == scope.selectedAccount.image_frequency_id) {
				scope.frequencyName = scope.frequencies[i].name;
			}
		};
	}

	scope.select = function (accountId) {
		scope.loaded = false;
		scope.selectedOrder = accountId;
		for (var i = scope.accounts.length - 1; i >= 0; i--) {
			if (scope.accounts[i].order_id == accountId) {
				ServerService.clientOrderDetailed(scope.clientId, accountId).then(function (data) {
		                if (data) {
		                   scope.selectedAccount = data;
		                   scope.getTotalSurface();
		                   scope.getOrderFrequencies();
		                   scope.sensorsCalculation();
		                   scope.getImages();
		                   scope.loaded = true;
		                } else {
		                   rootScope.errorOccured();
		                }
		        }, function(reason) {
		  				rootScope.errorOccured();
				});
			}
		};
	};


	scope.isActive = function (order) {
    	return scope.selectedOrder === order;
  	}



  	scope.getOrders = function () {
  		ServerService.clientOrders(scope.clientId).then(function (data) {
                if (data) {
                   scope.accounts = data;
                   scope.select(data[0].order_id);
                } else {
                   rootScope.errorOccured();
                }
    	}, function(reason) {
  				rootScope.errorOccured();
		});
  	}

  	scope.getOrders();


	scope.getFrequencies = function () {
		ServerService.getFrequencies().then(function (data) {
                if (data) {
                   scope.frequencies = data;
                } else {
                   rootScope.errorOccured();
                }
    	}, function(reason) {
  				rootScope.errorOccured();
		});
	}

	scope.getFrequencies();

	scope.getSensorTypesDetailed = function () {
		ServerService.getSensorTypes().then(function (data) {
                        if (data) {
                           scope.sensorTypes = data;
                        } else {
                            rootScope.errorOccured();
                        }
		}, function(reason) {
	    	rootScope.errorOccured();
		});
	}

	scope.getSensorTypesDetailed();

	scope.getSensorTypeName = function (type_id) {
		for (var i = scope.sensorTypes.length - 1; i >= 0; i--) {
			if (scope.sensorTypes[i].id == type_id) {
				return scope.sensorTypes[i].name;
			}
		};
	}

	scope.getUOMSymbol = function (type_id, uom_id) {
        for (var i = scope.sensorTypes.length - 1; i >= 0; i--) {
            if (scope.sensorTypes[i].id == type_id) {
                for (var j = scope.sensorTypes[i].uoms.length - 1; j >= 0; j--) {
                    if (scope.sensorTypes[i].uoms[j].id == uom_id) {
                        return scope.sensorTypes[i].uoms[j].symbol;
                    }
                };
            }
        };
    }


	scope.showInvoice = function () {
		var userLS = ServerService.getUserInStorage();
    	http.get('http://195.220.224.164/PaisImages/clients/'+ scope.selectedAccount.client_id + '/orders/'+ scope.selectedAccount.order_id + '/getInvoice', {
    		headers: {'X-Auth-Token': userLS.token},
    		responseType: 'arraybuffer'
    	}).success(function (data) {
           var file = new Blob([data], {type: 'application/pdf'});
           var fileURL = URL.createObjectURL(file);
           window.open(fileURL);
    	});
    }

    scope.getImages = function () {
        ServerService.clientOrderImages(scope.clientId, scope.selectedAccount.order_id).then(function (data) {
                        if (data) {
                           scope.selectedOrderImage = data;
                        } else {
                          selectedOrderImage = [];
                        }
                }, function(reason) {
                        selectedOrderImage = [];
                });
    }

    scope.getPolygonImagesCount = function (polygon_id) {
    	var imgs = 0;
    	if (scope.selectedOrderImage == undefined) {
    		return imgs;
    	}
    	if (scope.selectedOrderImage.length > 0) {
	    	angular.forEach(scope.selectedOrderImage, function(img) {
	    		if (img.polygon_id == polygon_id) {
	    			imgs ++;
	    		}
	    	});
   		}
    	return imgs;
    }

}]);