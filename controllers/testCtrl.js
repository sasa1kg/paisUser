angular.module('userApp').controller("testCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {
	scope.activeState = 0;
	scope.msg = "PAIS user!";

	scope.init = function () {
		alert(scope.polygonSelected);
	}

  	scope.recordings = [];
  	scope.availableColors = ['Snimanje 1','Snimanje 2','Snimanje 3','Snimanje 4','Snimanje 5'];

	scope.polygons = [];
	scope.polygonSurface = 0;
	scope.polygonSurfaceFixed = 0;
	scope.sensors = [];

	scope.polygonNotSelected = true;
	scope.markerNotSelected = true;

	scope.orderName = "";
	scope.dateFrom = "";
	scope.dateTo = "";

	scope.estimatedPrice = "620EUR";

	scope.multiselectmodel = [];
	scope.multiselectdata = [
    	{id: 1, label: "Tip 1 snimanja"},
    	{id: 2, label: "Tip 2 snimanja"},
    	{id: 3, label: "Tip 3 snimanja"},
    	{id: 4, label: "Tip 4 snimanja"},
    	{id: 5, label: "Tip 5 snimanja"}
    ];

	scope.multiselectsettings = {
	    smartButtonMaxItems: 1,
	    smartButtonTextConverter: function(itemText, originalItem) {
	        if (itemText === 'Jhon') {
	        return 'Jhonny!';
	        }

	        return itemText;
	    }
	};
		
	scope.date = '2015-07-10';
	scope.datepickerOptions = {
    	format: 'yyyy-mm-dd',
    	language: 'en',
    	autoclose: true,
    	weekStart: 0,
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
		var resetControl = $('<div id="again">PONOVO</div>').css({
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
				insertBoundsIntoDOM(event.overlay.position, mapDataId);
				mapOverlays.push(event.overlay);
				var sensor = event.overlay.position;
				scope.sensors.push(sensor);
				if (scope.markerNotSelected == true) {
					scope.markerNotSelected = false;
				}
			} else {
				var bounds = event.overlay.toCapArea();
				var paths = event.overlay.getPath();
				// Store geo data in DOM
				insertBoundsIntoDOM(bounds, mapDataId);
				// Store overlay in global array
				mapOverlays.push(event.overlay);
				var area = google.maps.geometry.spherical.computeArea(paths);
				var polygon = area/10000;
				scope.polygons.push(polygon);
				//alert (area/10000);
				//alert (scope.polygons.length);
				scope.polygonSurface = scope.polygonSurface + polygon;
				scope.polygonSurfaceFixed = scope.polygonSurface.toFixed(2);
				if (scope.polygonNotSelected == true) {
					scope.polygonNotSelected = false;
				}
			}
			// Get states intersecting the bounds
//			getTerritoriesFromGeom(event.overlay.toGeom(), 'los_estados', function(states, error) {
//				if (error) {
//					console.log(error);
//					return false;
//				}
//				// Store states in DOM
//				insertTerritoriesIntoDOM(states.toString(), 'states', mapDataId);
//			});
//			// Get municipalities intersecting the bounds
//			getTerritoriesFromGeom(event.overlay.toGeom(), 'los_municipios', function(municipalities, error) {
//				if (error) {
//					console.log(error);
//					return false;
//				}
//				// Store municipalities in DOM
//				insertTerritoriesIntoDOM(municipalities.toString(), 'municipalities', mapDataId);
//			});
		});

	});


	/*** DOM Operations ***/


	/**
	 * Inserts geo-data into DOM.
	 * <div id='map-data'>
	 *   <input name='area' value='28.381735043223106,-106.875 591.9281072234887'>
	 *   <input name='area' value='23.40,-98.34 18.47,-103.27 20.87,-92.81'>
	 * </div>
	 *
	 */
	function insertBoundsIntoDOM(bounds, domElementId) {
		console.log('insertBoundsIntoDOM("' + bounds + '")');
		/*var $input = $(document.createElement('input')).attr({
			name: 'area',
			value: bounds
		});
		$('#' + domElementId).append('<br />Región:',$input);*/
	}


	/**
	 * Inserts mexican geopolitical data into DOM.
	 * <div id='map-data'>
	 *   <input name='states' value='Baja California, Sonora'>
	 *   <input name='municipalities' value='Mexicali, Ensenada, Hermosillo'>
	 * </div>
	 *
	 */
	function insertTerritoriesIntoDOM(territories, key, domElementId) {
		console.log('insertTerritoriesIntoDOM("' + territories + '")');
		var $input = $(document.createElement('input')).attr({
			name: key,
			value: territories
		});
		$('#' + domElementId).append($input); 
	}


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
		scope.polygons = [];
		scope.sensors = [];
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