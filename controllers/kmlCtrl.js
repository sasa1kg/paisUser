angular.module('userApp').controller("kmlCtrl", ["$scope", "$http", "$filter", "ServerService", "$routeParams", "$rootScope",  
	function (scope, http, filter, ServerService, routeParams, rootScope) {

		scope.client_id = routeParams.client_id;
		scope.order_id = routeParams.order_id;
		scope.kml_id = routeParams.kml_id;

		scope.map = "";
		var myLatlng = new google.maps.LatLng(44, 20.461414);


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
				setKML(scope.map);  
			}
			, 1000); 


		});

		
	function setKML (map) {
		var kmlLayer = new google.maps.KmlLayer();
		var kmlUrl = 'http://195.220.224.164/PEP/pais/clients/'+ scope.client_id + '/orders/'+ scope.order_id + '/klms/' + scope.kml_id + '/klm';
		var kmlOptions = {
		  suppressInfoWindows: true,
		  preserveViewport: false,
		  map: map
		};
		var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
		google.maps.event.addListener(kmlLayer, 'click', function(event) {
		    var content = event.featureData.infoWindowHtml;
		    var testimonial = document.getElementById('capture');
		    testimonial.innerHTML = content;
		  });

	}


}]);