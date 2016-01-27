angular.module('userApp').controller("polygonsMapCtrl", ["$scope", "$http", "$filter", "ServerService", "$routeParams", "$rootScope",  
	function (scope, http, filter, ServerService, routeParams, rootScope) {

		scope.client_id = routeParams.client_id;
		scope.order_id = routeParams.order_id;

		scope.map = "";
		var myLatlng = new google.maps.LatLng(44, 20.461414);
		scope.getLang = function () {
			if (rootScope.getLanguage() === 'en') {
				scope.imagesLbl = "IMAGES:";
			} else {
				scope.imagesLbl = "SLIKE SA SNIMANJA:";
			}
		}
		scope.getLang();

		


		scope.getOrderDetails = function () {
			ServerService.clientOrderDetailed(scope.client_id, scope.order_id).then(function (data) {
				if (data) {
					scope.getImages();
					scope.selectedDetailed = data;
				} else {
					rootScope.errorOccured();
				}
			}, function(reason) {
				rootScope.errorOccured();
			});
		}

		scope.getImages = function () {
			ServerService.clientOrderImages(scope.client_id, scope.order_id).then(function (data) {
				if (data) {
					scope.orderImages = data;
				} else {
					rootScope.errorOccured();

				}
			}, function(reason) {
				rootScope.errorOccured();
			});
		}

		scope.getImagesOfPolygon = function (polygon_id) {
			var images = [];
			for (var i = scope.orderImages.length - 1; i >= 0; i--) {
				if (scope.orderImages[i].polygon_id == polygon_id && scope.orderImages[i].image_type != 3) {
					images.push(scope.orderImages[i]);
				}
			};
			return images;
		} 

		scope.getOrderDetails();

			scope.cutLargeImageName = function (dg_name) {
		      if (dg_name.indexOf("_dg") != -1) {
		            var n = dg_name.indexOf("_dg");
		            var res = dg_name.substring(0, n);
		            return res;
		      } else {
		        return dg_name;
		      }
		    }




		$(document).ready(function () {

			setTimeout(function(){ 
				var mapCanvasId = 'map-canvas-results',
				myOptions = {
					center: myLatlng,
					streetViewControl: false,
					mapTypeId: google.maps.MapTypeId.HYBRID,
					zoom: 7,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.LEFT_CENTER
					}
				}
				scope.map = new google.maps.Map(document.getElementById(mapCanvasId), myOptions);
				setTerritories(scope.map, scope.selectedDetailed.polygons, scope.order_id);   
			}
			, 1000); 


		});

		scope.polygonsOnMap = [];
		scope.markersOnMap = [];


		function setTerritories(map, polygons, order_id) {
			for (var i = scope.polygonsOnMap.length - 1; i >= 0; i--) {
				scope.polygonsOnMap[i].setMap(null);
				scope.markersOnMap[i].setMap(null);
			};    
			var bounds = new google.maps.LatLngBounds();
			for (var x = polygons.length - 1; x >= 0; x--) {
				var polygon = polygons[x];
				var territoryCoords = [];
				for (var i = polygon.coordinates.length - 1; i >= 0; i--) {
					territoryCoords.push({
						lat : polygon.coordinates[i].latitude,
						lng: polygon.coordinates[i].longitude
					});
					bounds.extend(new google.maps.LatLng(polygon.coordinates[i].latitude, polygon.coordinates[i].longitude));
				};

				var territory = new google.maps.Polygon({
					paths: territoryCoords,
					strokeColor: '#FF0000',
					strokeOpacity: 0.8,
					strokeWeight: 3,
					fillColor: '#FF0000',
					fillOpacity: 0.35
				});

				var imagesOnPoly = scope.getImagesOfPolygon(polygon.polygon_id);


				var contentString = polygon.description +" <hr>"+ scope.imagesLbl + "</br>";
				for (var i = imagesOnPoly.length - 1; i >= 0; i--) {
					if (imagesOnPoly[i].image_type == 2) {
						contentString = contentString + " > <a href='#/recordingDg/"+ scope.client_id +"/" + scope.order_id +"/" + imagesOnPoly[i].image_id + "/" + polygon.polygon_id + "/'>" + scope.cutLargeImageName(imagesOnPoly[i].document_name) + " [LG]</a> | " + imagesOnPoly[i].document_created_at + "</br>";
					} else {
						contentString = contentString + " > <a href='#/recording/"+ scope.client_id +"/" + scope.order_id +"/" + imagesOnPoly[i].image_id + "/" + polygon.polygon_id + "/'>" + imagesOnPoly[i].document_name + "</a> | " + imagesOnPoly[i].document_created_at + "</br>";
					}
				};

				var infowindow = new google.maps.InfoWindow({content: contentString});


				var marker = new google.maps.Marker({
					position: territoryCoords[0],
					map: map,
					icon: "img/cropcircles.png",
					title: "Territory"
				});
				google.maps.event.addListener(marker, 'click', 
					function (infowindow, marker) {
						return function () {
							infowindow.open(map, marker);
						};
					}(infowindow, marker)
					);


				territory.setMap(scope.map);
				marker.setMap(scope.map);
				scope.markersOnMap.push(marker);
				scope.polygonsOnMap.push(territory);
				

			};
			scope.map.fitBounds(bounds);
		}



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