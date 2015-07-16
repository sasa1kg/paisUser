angular.module('userApp').controller("resultsCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {

	console.log("Results!");
	scope.msg = "User results!";

	var myLatlng = new google.maps.LatLng(44, 20.461414);
	scope.map = "";
	var sensors = 
    [
      ['Senzor temperature', 44.1, 20.461414, 1],
      ['Senzor temperature', 44, 20.261414, 2],
      ['Senzor vlaznosti', 43.9, 20.661414, 3],
      ['Senzor vlaznosti', 44.05, 20.861414, 4],
      ['Senzor vlaznosti', 44, 20.461414, 5]
    ];
    scope.recordings = [
    		{
    			"name" : "A_slika_Op1_Absa",
    			"type" : "IR slika",
    			"date" : "20.07.2015",
    			"id" : "1"
    		},
    		{
    			"name" : "B_slika_Op2_Ipsy",
    			"type" : "AIR slika",
    			"date" : "19.07.2015",
    			"id" : "2"
    		},
    		{
    			"name" : "D_slika_Op2_Xfeg",
    			"type" : "Tip2 slika",
    			"date" : "21.07.2015",
    			"id" : "3"
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

	scope.selectedOrder = "njiva";

	scope.isActive = function (order) {
    	return scope.selectedOrder === order;
  	}
	scope.accounts = [
		{
			"id" : 0,
			"name" : "njiva",
			"recordings" : 6,
			"sensors" : 2
		},
		{
			"id" : 1,
			"name" : "livada",
			"recordings" : 2,
			"sensors" : 1
		},
		{
			"id" : 2,
			"name" : "vocnjak",
			"recordings" : 1,
			"sensors" : 1
		},
		{
			"id" : 3,
			"name" : "malinjak",
			"recordings" : 4,
			"sensors" : 2
		},
		{
			"id" : 3,
			"name" : "jos nesto",
			"recordings" : 3,
			"sensors" : 0
		}
	];

	scope.selectOrder = function (account) {
		for (var i = scope.accounts.length - 1; i >= 0; i--) {
			if (scope.accounts[i].id == account) {
				scope.selectedOrder = scope.accounts[i].name;
				break;
			}
		};
		setMarkers(scope.map, sensors);
	};


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
		setMarkers(scope.map, sensors);
	});


	function setMarkers(map, locations) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++) 
    {
            var sensors = locations[i];
            var coords = new google.maps.LatLng(sensors[1], sensors[2]);
            var contentString = sensors[0] +" <br/> <a href='#/sensor/" + sensors[3] + "/'> <b>MERENJA</b> </a><br/>";
            var infowindow = new google.maps.InfoWindow({content: contentString});
            
            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: "img/waterfilter.png",
                title: sensors[0]
            });
            google.maps.event.addListener(marker, 'click', 
                function (infowindow, marker) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }(infowindow, marker)
            );
            bounds.extend(coords);
            scope.map.fitBounds(bounds);
    }
}

 
}]);