angular.module('userApp').controller("imagesCtrl", ["$scope", "$http", "$filter",  
	function (scope, http, filter) {

	var myLatlng = new google.maps.LatLng(44, 20.461414);

	$(document).ready(function () {

		var mapCanvasId = 'map-canvas-kml',
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
		setKML(scope.map);
	});


	function setKML(map) {
    var kmlUrl = 'http://agro-pais.com/services/backig1.kml';
    var kmlOptions = {
        suppressInfoWindows: false,
        preserveViewport: false,
        map: map
    };
    var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
    google.maps.event.addListener(kmlLayer, 'click', function(event) {
        console.log(event);
    });
}

 
}]);