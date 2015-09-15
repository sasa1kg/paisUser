angular.module('userApp').controller("testCtrl", ["$rootScope" ,"$scope", "$http", "$filter", "$translate", "ServerService",  
	function (rootScope, scope, http, filter, translate, ServerService) {

	scope.msg = "PAIS user! " + new Date(); 

	scope.init = function () {
		scope.clientId = 22;

		rootScope.evaluated = false;
		rootScope.evaluatedError = false;
		rootScope.evaluationAvailable = true;
		scope.generalError = false;

		scope.orderNameInvalid = false;
		scope.orderImgTypeInvalid = false;
		scope.orderDescInvalid = false;

		scope.setMultiselectIN();
	}

	scope.init();



	scope.multiselectmodel = [];
    scope.multiselectdata = [];
    	scope.multiselectsettings = {
	    smartButtonMaxItems: 2,
	};

	scope.setMultiselectIN = function () {
		alert(rootScope.getLanguage());
		if (rootScope.getLanguage() === 'en') {
			scope.msTranslate = {
				'buttonDefaultText' : 'Select',
				'uncheckAll' : 'Uncheck All',
				'selectionCount' : 'checked',
				'selectionOf' : '/',
				'searchPlaceholder' : 'Search...',
				'checkAll' : 'Check All',
				'dynamicButtonTextSuffix' : 'checked'
			}
		} else {
			alert("serbian");
			scope.msTranslate = {
				'buttonDefaultText' : 'Izaberi',
				'uncheckAll' : 'Isključi sve',
				'selectionCount' : 'obeleženo',
				'selectionOf' : '/',
				'searchPlaceholder' : 'Pretraži...',
				'checkAll' : 'Obeleži sve',
				'dynamicButtonTextSuffix' : 'obeleženo'
			}
		}
	};



	scope.validateName = function () {
		if (scope.order.name == undefined || scope.order.name.length < 3) {
			return false;
		} else {
			return true;
		} 
	}

	scope.validatePolygons = function () {
		if (scope.order.polygons.length != 0 && scope.order.imageTypes.length == 0) {
			return false;
		} else {
			return true;
		}
	}

	scope.validateDescription = function () {
		if (scope.order.description == undefined || scope.order.description.length > 100) {
			return false;
		} else {
			return true;
		} 
	}


	scope.injectToRoot = function() {
		// if (scope.order.name == undefined || scope.order.name.length < 3) {
		// 	alert("Enter name");
		// 	return;
		// } 
		// if (scope.order.polygons.length != 0 && scope.order.imageTypes.length == 0) {
		// 	alert("Select image types");
		// 	return;
		// }


		for (var i = scope.multiselectmodel.length - 1; i >= 0; i--) {
			scope.order.imageTypes.push({
				"image_type_id" : parseInt(scope.multiselectmodel[i].id)
			});
		};

		scope.order.image_frequency_id = parseInt(scope.order.image_frequency_id);


		rootScope.evaluated = false;
		rootScope.evaluatedError = false;
		rootScope.evaluationAvailable = true;
		rootScope.estimateOrder = scope.order;
		rootScope.estimateSurface = scope.polygonSurfaceFixed;
		if (rootScope.estimateOrder.polygons.length == 0) {
			rootScope.estimateOrder.imageTypes = [];
			rootScope.estimateOrder.image_frequency_id = "";
		}
	}


	scope.test = function () {
		alert(angular.toJson(scope.order));
		alert (angular.toJson(scope.multiselectmodel));
		//alert(angular.toJson(scope.order.polygons));
		//$('#estimateModal').show();
	}

	scope.getImageTypes = ServerService.getImageTypes().then(function (data) {
                if (data) {
                	for (var i = data.length - 1; i >= 0; i--) {
                		var type = {
                			id : data[i].id,
                			label: data[i].name
                		};
                		scope.multiselectdata.push(type);
                		scope.multiselectmodel.push(type);
                	};
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
  				scope.generalError = true;
	});

	scope.getFrequencies = ServerService.getFrequencies().then(function (data) {
                if (data) {
                   scope.order.image_frequency_id = data[0].id;
                   scope.frequencies = data;
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
  				scope.generalError = true;
	});


	scope.getSensorTypes = ServerService.getSensorTypes().then(function (data) {
                if (data) {
                   scope.sensorTypes = data;
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
  				scope.generalError = true;
	});

	rootScope.evaluated = false;
	rootScope.evaluatedError = false;
	rootScope.evaluationAvailable = true;
	scope.evaluate = function () {
		ServerService.evaluateOrder(scope.clientId, rootScope.estimateOrder).then(function (data) {
                if (data) {
                   scope.estimatedPrice = data.value;
                   scope.currency = data.currency;
                   rootScope.evaluationAvailable = false;
                   rootScope.evaluated = true;
                } else {
                   rootScope.evaluationAvailable = false;
                   rootScope.evaluated = false;
                   rootScope.evaluatedError = true;
                }
    	}, function(reason) {
    			rootScope.evaluationAvailable = false;
                rootScope.evaluated = false;
                rootScope.evaluatedError = true;
		});
	}

	scope.orderPlaced = false;
	scope.orderSuccess = false;
	scope.placeOrder = function () {
		var orderToPlace = rootScope.estimateOrder;

		alert(scope.clientId);
		alert(angular.toJson(orderToPlace));

		ServerService.placeOrder(scope.clientId, orderToPlace).then(function (data) {
                if (data) {
                   scope.orderPlaced = true;
				   scope.orderSuccess = true;
                } else {
                  	scope.orderSuccess = false;
                }
    	}, function(reason) {
  				scope.orderSuccess = false;
		});
		
	}


	scope.order = {
		"name" : "",
		"description" : "",
		"image_frequency_id" : "",
		"imageTypes" : [],
		"polygons": [],
		"sensors" : []
	}



	scope.polygonSurface = 0;
	scope.polygonSurfaceFixed = 0;


	scope.polygonNotSelected = true;
	scope.markerNotSelected = true;
	
	scope.typeChange = function () {
		console.log(scope.sensors);
	}



	scope.estimate = function() {
		$('#warning').show();
	}

	/**
	 * A library to draw overlays on top of Google Maps to get geospatial info
	 * Author: @rodowi
	 * Updated: 2014-03
	 * TODO: draggable, editable
	 */
	var mapOverlays = [],
	mapDataId = 'map-data',
	mapOverlayStyle = {
			fillColor: '#21CCCA',
			fillOpacity: 0.75,
			strokeWeight: 0.95
	};


	/**
	 * Upon page load, setup map and bind listeners
	 *
	 */
	$(document).ready(function () {

		// Variables and definitions
		var mapCanvasId = 'map-canvas',
		map = new google.maps.Map(document.getElementById(mapCanvasId), {
			center: new google.maps.LatLng(44, 20.461414),
			streetViewControl: false,
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.HYBRID,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			}
		});

		// Setup drawing manager
		var drawingManager = new google.maps.drawing.DrawingManager({
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.LEFT_TOP,
				drawingModes: [
				               google.maps.drawing.OverlayType.MARKER,
				               google.maps.drawing.OverlayType.POLYGON
				               ]
			},
			circleOptions: mapOverlayStyle,
			polygonOptions: mapOverlayStyle,
			markerOptions: {
				title: "Senzor",
				icon: "img/waterfilter.png"
			},
		});
		drawingManager.setMap(map);

		// Add custom clear button
		var resetControl = $('<div id="again">RESET</div>').css({
			backgroundColor: 'white',
			borderColor: '#AAA',
			borderStyle: 'solid',
			borderWidth: '1px',
			color: '#333',
			cursor: 'pointer',
			margin: '5px',
			padding: '5px'
		})[0];
		map.controls[google.maps.ControlPosition.TOP_CENTER].push(resetControl);
		google.maps.event.addDomListener(resetControl, 'click', function() {
			resetMap();
		});

		// Insert a DIV container to hold geospatial data from the map
		var $mapData = $('<div></div>')
		.attr('id', mapDataId)
		.css('padding', '0 10px 10px 10px');
		$('#' + mapCanvasId).after($mapData);

		// Events to be trigger when drawing completes
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
			// Get bounds in CAP <area> format
			if (event.type == google.maps.drawing.OverlayType.MARKER) {
				//insertBoundsIntoDOM(event.overlay.position, mapDataId);
				mapOverlays.push(event.overlay);
				var sensor = event.overlay.position;
				var infowindow = new google.maps.InfoWindow({
					content: "Senzor " + (scope.order.sensors.length+1) 
				});
				infowindow.open(map, event.overlay);
				google.maps.event.addListener(event.overlay, 'click', function() {
					infowindow.open(map,event.overlay);
				});
				var sensorInfo = {
					"latitude" : sensor.G,
					"longitude" : sensor.K,
					"description" : "",
					"uom_id" : "",
					"type_id" : ""
				};
				scope.order.sensors.push(sensorInfo);
				console.log("sensors " + scope.order.sensors.length);
				if (scope.markerNotSelected == true) {
					scope.markerNotSelected = false;
				}
			} else {
				var paths = event.overlay.getPath();
				var myCoordArray = event.overlay.toCapAreaArray();
				mapOverlays.push(event.overlay);
				var area = google.maps.geometry.spherical.computeArea(paths);
				var polygon = area/10000;
				var polygonInfo = {
					"coordinates" : [],
					"surface": 0
				};
				for (var i = myCoordArray.length - 1; i >= 0; i--) {
					polygonInfo.coordinates.push(myCoordArray[i]);
				}
				scope.polygonSurface = scope.polygonSurface + polygon;
				scope.polygonSurfaceFixed = scope.polygonSurface.toFixed(2);
				polygonInfo.surface = parseFloat(scope.polygonSurfaceFixed);
				console.log("polygonSurfaceFixed " + scope.polygonSurfaceFixed);
				scope.order.polygons.push(polygonInfo);
				if (scope.polygonNotSelected == true) {
					scope.polygonNotSelected = false;
				}
				scope.setMultiselectIN();
			}
		});

	});

	/**
	 * Removes map overlays and DOM elements with map data
	 */
	function resetMap() {
		removeMapOverlays();
		removeMapData();
		scope.polygonNotSelected = true;
		scope.markerNotSelected = true;
		scope.polygonSurface = 0;
		scope.polygonSurfaceFixed = 0;
		scope.order.polygons = [];
		scope.order.sensors = [];
	}


	/**
	 * Removes map overlays (global variable)
	 *
	 */
	function removeMapOverlays() {
		while(mapOverlays[0])
			mapOverlays.pop().setMap(null);
	}


	/**
	 * Removes DOM elements with map data
	 *
	 */
	function removeMapData() { $('#' + mapDataId).empty() }


	/*** CartoDB API operations ***/


	/**
	 * Requests CartoDB API to retrieve a list of mexican territories intersecting a geometry.
	 * Levels supported are 'los_estados' (states) and 'los_municipios' (municipalities).
	 *
	 */
	function getTerritoriesFromGeom(geom, level, callback) {
		console.log('getTerritoriesFromGeom("' + geom + '")');
		var baseUrl = 'http://rodowi.cartodb.com/api/v2/sql?q=';
		var query = "SELECT nombre FROM " + level + " WHERE ST_Intersects(the_geom," + geom + ")";
		$.ajax({
			url: baseUrl + query,
			dataType: 'json',
			success: function(data) {
				var territories = [];
				data.rows.forEach(function(element, index) {
					territories.push(element.nombre);
				});
				callback(territories.toString());
			},
			error: function(error) {
				callback(null, error);
			}
		});
	}


	/*** Maps extensions ***/


	/**
	 * Both methods return a string with geospatial info of a map overlay formatted for CAP <area> elements
	 * Note: As of Maps API v3.exp radius is given in meters and CAP v1.2 use KM
	 * https://developers.google.com/maps/documentation/javascript/reference#Circle
	 * http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html
	 * Note: first and last pair of coordinates should be equal
	 *
	 */

	google.maps.Polygon.prototype.toCapArea = function () {
		var capArea = '';
		this.getPath().forEach(function (element, index) {
			capArea += element.lat() + ',' + element.lng() + ' ';
		});
		var start = this.getPath().getAt(0);
		capArea += start.lat() + ',' + start.lng();
		return capArea;
	};

	google.maps.Polygon.prototype.toCapAreaArray = function () {
		var capArea = [];
		this.getPath().forEach(function (element, index) {
			var coord = {
				"latitude" : element.lat().toString(),
				"longitude" : element.lng().toString()
			}
			capArea.push(coord);
		});
		var start = this.getPath().getAt(0);
		return capArea;
	};

	google.maps.Circle.prototype.toCapArea = function() {
		return this.getCenter().lat() + ',' + this.getCenter().lng() + ' ' + this.getRadius() / 1000;
	};


	/**
	 * Both methods return a string representing a PostGIS geometry of a map overlay
	 * Note: EWKT format (used in PostGIS) inverts lat/lng order, e.g. SRID=4326;POINT(-44.3 60.1)
	 * to locate a longitude/latitude coordinate using the WGS 84 reference coordinate system.
	 * http://en.wikipedia.org/wiki/Well-known_text
	 * Note: first and last pair of coordinates should be equal
	 * Note: PostGIS doesn't support WKT for circles yet
	 * http://postgis.refractions.net/documentation/manual-1.4/ch04.html
	 * http://gis.stackexchange.com/questions/10352/how-to-create-a-circle-in-postgis
	 *
	 */

	google.maps.Polygon.prototype.toGeom = function() {
		var wkt = "ST_GeomFromText('POLYGON ((";
		this.getPath().forEach(function (element, index) {
			wkt += element.lng() + ' ' + element.lat() + ',';
		});
		var start = this.getPath().getAt(0);
		wkt += start.lng() + ' ' + start.lat();
		return wkt + "))', 4326)";
	};

	google.maps.Circle.prototype.toGeom = function() {
		var center = this.getCenter().lng() + ' ' + this.getCenter().lat();
		return "ST_Buffer(geography(ST_GeomFromText('POINT(" + center + ")', 4326)), " + this.getRadius() + ")";
	};




	scope.map = {   center: { 
		latitude: 45, 
		longitude: -73 }, 
		zoom: 8,
		polys: [],
		draw: undefined,
		refresh: false,
		options: [],
		events: []};

	/*
	scope.init = function  () {

		alert("Initialize map");

		var mapOptions = {
				center: new google.maps.LatLng(51.503454,-0.119562),
				zoom: 8,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		};



		var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	};

	google.maps.event.addDomListener(window, 'load', scope.init);*/





}]);