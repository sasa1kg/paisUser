angular.module('userApp').controller("resultsCtrl", ["$scope", "$http", "$filter", "ServerService",  
    function (scope, http, filter, ServerService) {
	console.log("Results!");
	scope.msg = "User results!";

    scope.clientId = 22;

	var myLatlng = new google.maps.LatLng(44, 20.461414);
	scope.map = "";
    scope.generalError = false;

    scope.getOrders = ServerService.clientOrders(scope.clientId).then(function (data) {
                if (data) {
                   console.log("Accounts " + data.length);
                   scope.accounts = data;
                   scope.select(data[0].order_id);
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
                scope.generalError = true;
    });

    scope.select = function (accountId) {
        scope.loaded = false;
        for (var i = scope.accounts.length - 1; i >= 0; i--) {
            if (scope.accounts[i].order_id == accountId) {
                ServerService.clientOrderDetailed(scope.clientId, accountId).then(function (data) {
                        if (data) {
                           scope.selectedAccount = data;
                           scope.loaded = true;
                           setMarkers(scope.map, scope.selectedAccount.sensors, scope.selectedAccount.order_id);
                        } else {
                           scope.generalError = true;
                        }
                }, function(reason) {
                        scope.generalError = true;
                });
            }
        };
    };


    scope.recordings = [
    		{
    			"name" : "A_slika_Op1_Absa",
    			"type" : "IR slika",
    			"date" : "20.07.2015",
    			"id" : "1",
                "lat" : 44.03,
                "longitude" : 20.2591
    		},
    		{
    			"name" : "B_slika_Op2_Ipsy",
    			"type" : "AIR slika",
    			"date" : "19.07.2015",
    			"id" : "2",
                "lat" : 44.84,
                "longitude" : 19.84
    		},
    		{
    			"name" : "D_slika_Op2_Xfeg",
    			"type" : "Tip2 slika",
    			"date" : "21.07.2015",
    			"id" : "3",
                "lat" : 43.71,
                "longitude" : 20.74561
    		}
    ];

    scope.order = "date";

    scope.orderByName = function () {
    	scope.order = "name";
    }
    scope.orderByType = function () {
    	scope.order = "type";
    }
    scope.orderByDate = function () {
    	scope.order = "date";
    }

	scope.isActive = function (order) {
        if (scope.selectedAccount != null) {
    	   return scope.selectedAccount.order_id == order;
        } else {
           return false;
        }
  	}

    scope.getSensorTypes = ServerService.getSensorTypes().then(function (data) {
                if (data) {
                    scope.sensor_types = data;
                } else {
                    scope.generalError = true;
                }
    }, function(reason) {
         scope.generalError = true;       
    });


	$(document).ready(function () {

		var mapCanvasId = 'map-canvas-results',
		myOptions = {
            center: myLatlng,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.HYBRID,
			zoom: 8,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			}
        }
		scope.map = new google.maps.Map(document.getElementById(mapCanvasId), myOptions);
	});


	function setMarkers(map, sensors, order_id) {
    for (var i = scope.sensorsOnMap.length - 1; i >= 0; i--) {
            scope.sensorsOnMap[i].setMap(null);
        };    
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < sensors.length; i++) 
        {
            var sensor = sensors[i];
            var title = "N/A";
            var getType = function () {
                for (var i = scope.sensor_types.length - 1; i >= 0; i--) {
                    console.log(scope.sensor_types[i].name);
                    if (scope.sensor_types[i].id == sensor.type_id) {
                        title = scope.sensor_types[i].name;
                    }
                };

            };

            getType();

            var coords = new google.maps.LatLng(sensor.latitude, sensor.longitude);
            var contentString = sensor.description + " <br/> <hr>" + 
            title + " <br/> " +
            " <a href='#/sensor/" + scope.clientId +"/" + order_id + "/measurement/" + sensor.sensor_id + "/'> <b>MERENJA</b> </a><br/>";
            var infowindow = new google.maps.InfoWindow({content: contentString});
            


            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: "img/waterfilter.png",
                title: title
            });
            google.maps.event.addListener(marker, 'click', 
                function (infowindow, marker) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }(infowindow, marker)
            );
            scope.sensorsOnMap.push(marker);
            bounds.extend(coords);
            scope.map.fitBounds(bounds);
        }
    }

    scope.sensorsOnMap = [];

    scope.getTypeName = function (id) {
        ServerService.getSensorType(id).then(function (data) {
                if (data) {
                   return data.sensor_type_name;
                } else {
                   return "N/A";
                }
        }, function(reason) {
            return "N/A";
        });
    }



}]);