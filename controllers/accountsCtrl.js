angular.module('userApp').controller("accountsCtrl", ["$scope", "$http", "$filter", "ServerService",  
	function (scope, http, filter, ServerService) {
	scope.activeState = 1;
	console.log("Accounts!");
	scope.msg = "User accounts!";

	scope.clientId = 22;



	scope.selectedAccount = "";
	scope.accounts = [];
	scope.loaded = false;


	scope.sensorsCalculation = function () {
		scope.nonActiveSensors = 0;
		scope.activeSensors = 0;
		for (var i = scope.selectedAccount.sensors.length - 1; i >= 0; i--) {
			if (scope.selectedAccount.sensors[i].active == 0) {
				scope.nonActiveSensors = scope.nonActiveSensors + 1;
			} else {
				scope.activeSensors = scope.activeSensors + 1;
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
		                   scope.loaded = true;
		                } else {
		                   alert("Data null");
		                }
		        }, function(reason) {
		  				alert('Failed: ' + reason);
				});
			}
		};
	};


	scope.isActive = function (order) {
    	return scope.selectedOrder === order;
  	}



  	scope.getOrders = ServerService.clientOrders(scope.clientId).then(function (data) {
                if (data) {
                   console.log("Accounts " + data.length);
                   scope.accounts = data;
                   scope.select(data[0].order_id);
                } else {
                   alert("Data null");
                }
    }, function(reason) {
  				alert('Failed: ' + reason);
	});


	scope.getFrequencies = ServerService.getFrequencies().then(function (data) {
                if (data) {
                   scope.frequencies = data;
                } else {
                   alert("Data null");
                }
    }, function(reason) {
  				alert('Failed: ' + reason);
	});


	scope.showInvoice = function () {
    	http.get('http://195.220.224.164/pais/clients/'+ scope.selectedAccount.client_id + '/orders/'+ scope.selectedAccount.order_id + '/getInvoice', {responseType: 'arraybuffer'})
       .success(function (data) {
           var file = new Blob([data], {type: 'application/pdf'});
           var fileURL = URL.createObjectURL(file);
           window.open(fileURL);
    });
    }

}]);