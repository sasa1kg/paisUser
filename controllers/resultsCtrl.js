angular.module('userApp').controller("resultsCtrl", ["$rootScope", "$scope", "$http", "$filter", "ServerService", "$routeParams",  
    function (rootScope, scope, http, filter, ServerService, routeParams) {


       scope.order_id = routeParams.order_id;

       scope.clientId = "mySensor";

       var myLatlng = new google.maps.LatLng(44, 20.461414);
       scope.map = "";
       scope.generalError = false;

       scope.getLang = function () {
        if (rootScope.getLanguage() === 'en') {
            scope.measurementLink = "MEASUREMENT";
            scope.notActive = "NOT ACTIVE";
            scope.activeFrom = "Active from: ";
        } else {
            scope.measurementLink = "MERENJA";
            scope.notActive = "NEAKTIVAN";
            scope.activeFrom = "Active from: ";
        }
    }

    scope.imagesPanelOpen = true;

    scope.toogleImagesPanel = function () {
        scope.imagesPanelOpen = !scope.imagesPanelOpen;
    }

    scope.kmlPanelOpen = true;

    scope.toogleKmlPanel = function () {
        scope.kmlPanelOpen = !scope.kmlPanelOpen;
    }

    scope.getLang();

    scope.getOrders = ServerService.clientOrders(scope.clientId).then(function (data) {
        if (data) {
         scope.accounts = data;
         if (data.length > 0) {
            if (scope.order_id != undefined && scope.order_id != null) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].order_id == scope.order_id) {
                        scope.select(data[i].order_id);
                    }
                };
            } else {
                scope.select(data[0].order_id);
            }
        }
    } else {
     rootScope.errorOccured();
 }
}, function(reason) {
    rootScope.errorOccured();
});

    scope.select = function (accountId) {
        scope.loaded = false;
        for (var i = scope.accounts.length - 1; i >= 0; i--) {
            if (scope.accounts[i].order_id == accountId) {
                ServerService.clientOrderDetailed(scope.clientId, accountId).then(function (data) {
                    if (data) {
                     scope.selectedAccount = data;
                     if (scope.selectedAccount.stations.length > 0) {
                        setMarkers(scope.map, scope.selectedAccount.stations, scope.selectedAccount.order_id);
                    }
                    scope.getImages(accountId);
                    scope.getKMLs(accountId);
                } else {
                 scope.generalError = true;
             }
         }, function(reason) {
            scope.generalError = true;
        });
            }
        };
    };

    scope.getPolygonName = function (polygonId) {
        for (var i = scope.selectedAccount.polygons.length - 1; i >= 0; i--) {
            if (scope.selectedAccount.polygons[i].polygon_id == polygonId) {
                return scope.selectedAccount.polygons[i].description;
            }
        };
    }

    scope.getImages = function (accountId) {
        scope.orderImages = [];
        ServerService.clientOrderImages(scope.clientId, accountId).then(function (data) {
            if (data) {
             if (data.length > 0) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].image_type != 3) {
                        scope.orderImages.push(data[i]);
                    }
                };
             } else {
                scope.orderImages = [];
             }
             scope.loaded = true;
         } else {
             scope.orderImages = [];
             scope.loaded = true;
         }
     }, function(reason) {
        scope.orderImages = [];
        scope.loaded = true;
    });
    }

    scope.getKMLs = function (accountId) {
     ServerService.getKMLs(scope.clientId, accountId).then(function (data) {
         if (data) {
             scope.kmls = data;
         } else {
             scope.kmls = [];
         }
     }, function(reason) {
        scope.kmls = [];
    });
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
        rootScope.errorOccured();
    }
}, function(reason) {
   rootScope.errorOccured();    
});


$(document).ready(function () {

    setTimeout(function(){ 
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
        setMarkers(scope.map, scope.selectedAccount.stations, scope.selectedAccount.order_id);    
    }
    , 1500); 


});


function setMarkers(map, stations, order_id) {
    setTimeout(function(){     
        for (var i = scope.sensorsOnMap.length - 1; i >= 0; i--) {
            scope.sensorsOnMap[i].setMap(null);
        };    
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < stations.length; i++) 
        {
            var station = stations[i];
            var title = "Sensor Station (Senz. stanica) " + station.station_id;
            var getType = function (type_id) {
                for (var i = scope.sensor_types.length - 1; i >= 0; i--) {
                    console.log(scope.sensor_types[i].name);
                    if (scope.sensor_types[i].id == type_id) {
                        return scope.sensor_types[i].name;
                    }
                };

            };


            var coords = new google.maps.LatLng(station.latitude, station.longitude);
            var contentString = title + "<br/> <hr>" + station.station_description + " <br/> <hr>";

            for (var k = station.sensors.length - 1; k >= 0; k--) {
                var sensType = getType(station.sensors[k].type_id);
                contentString = contentString + sensType + " <br/> ";
                contentString = contentString + station.sensors[k].description + " <br/> ";
                if (station.sensors[k].active == 1) {
                    contentString = contentString +
                    scope.activeFrom + station.sensors[k].activate_at + "</br>" +
                    " <a href='#/sensor/" + scope.clientId +"/" + order_id + "/" + station.station_id + "/measurement/" + station.sensors[k].sensor_id + "/'> <b> " + scope.measurementLink + "</b> </a><br/><hr>";
                } else {
                    contentString = contentString + "<b>" + scope.notActive+ "</b><br/><hr>";
                }

            };


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
        }
        scope.map.fitBounds(bounds);
    }
    , 1000); 
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