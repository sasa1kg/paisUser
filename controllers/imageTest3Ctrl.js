angular.module('userApp').controller("imageTest3Ctrl", ["$scope", "$http", 
	"$filter", "$routeParams", "ServerService", "$rootScope", "$modal", "$location", 
	function (scope, http, filter, rootParams, ServerService, rootScope, modal, location) {


		var Demo = Demo || {};
        Demo.ImagesBaseUrl = 'imagetest/output/';

        // CroftMap class
        //////////////////////////////////
        Demo.CroftMap = function (container) {
            // Create map
            this._map = new google.maps.Map(container, {
                zoom: 1,
                center: new google.maps.LatLng(0, -20),
                mapTypeControl: false,
                streetViewControl: false
            });

            // Set custom tiles
            this._map.mapTypes.set('croft', new Demo.ImgMapType('croft2', '#4E4E4E'));
            this._map.setMapTypeId('croft');
        };


        // ImgMapType class
        //////////////////////////////////
        Demo.ImgMapType = function (theme, backgroundColor) {
            this.name = this._theme = theme;
            this._backgroundColor = backgroundColor;
        };

        Demo.ImgMapType.prototype.tileSize = new google.maps.Size(256, 256);
        Demo.ImgMapType.prototype.minZoom = 0;
        Demo.ImgMapType.prototype.maxZoom = 5;

        Demo.ImgMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
            var tilesCount = Math.pow(2, zoom);

            if (coord.x >= tilesCount || coord.x < 0 || coord.y >= tilesCount || coord.y < 0) {
                var div = ownerDocument.createElement('div');
                div.style.width = this.tileSize.width + 'px';
                div.style.height = this.tileSize.height + 'px';
                div.style.backgroundColor = this._backgroundColor;
                return div;
            }

            var img = ownerDocument.createElement('IMG');
            img.width = this.tileSize.width;
            img.height = this.tileSize.height;
            img.src = Demo.Utils.GetImageUrl(this._theme + '/tile_' + zoom + '_' + coord.x + '-' + coord.y + '.png');

            return img;
        };

        // ZoomButtonControl class
        //////////////////////////////////
        Demo.ZoomButtonControl = function (container, map, level) {
            var button = document.createElement('IMG');
            button.style.cursor = 'pointer';
            button.src = Demo.Utils.GetImageUrl(level > 0 ? 'plus.png' : 'minus.png');
            container.appendChild(button);

            google.maps.event.addDomListener(button, 'click', function () {
                map.setZoom(map.getZoom() + level);
            });
        };

        // ImageControl class
        //////////////////////////////////
        Demo.ImageControl = function (image, container, map, callback) {
            var button = document.createElement('IMG');
            button.style.cursor = 'pointer';
            button.style.display = 'block';
            button.src = Demo.Utils.GetImageUrl(image);
            container.appendChild(button);

            google.maps.event.addDomListener(button, 'click', function () {
                callback();
            });
        };

        // ZoomLevelsControl class
        //////////////////////////////////
        Demo.ZoomLevelsControl = function (container, map) {
            this._container = container;
            this._map = map;

            this._buildUI();
            this._updateUI();
            this._bindZoomEvent();
        };

        Demo.ZoomLevelsControl.prototype._buildUI = function () {
            var currentMapType = this._map.mapTypes.get(this._map.getMapTypeId());

            for (var i = currentMapType.maxZoom; i >= currentMapType.minZoom; i--) {
                var level = document.createElement('IMG');
                level.style.cursor = 'pointer';
                if (i != currentMapType.minZoom) level.style.marginBottom = '2px';
                level.style.display = 'block';
                level.src = Demo.Utils.GetImageUrl('level.png');
                this._bindLevelClick(level, i);
                this._container.appendChild(level);
            }
        };

        Demo.ZoomLevelsControl.prototype._updateUI = function () {
            var currentMapType = this._map.mapTypes.get(this._map.getMapTypeId());
            var currentZoom = this._map.getZoom();
            var levelsCount = currentMapType.maxZoom - currentMapType.minZoom;

            for (var i = 0; i < levelsCount; i++)
            Demo.Utils.SetOpacity(this._container.childNodes[i], (currentMapType.maxZoom - i) <= currentZoom ? 100 : 30);
        };

        Demo.ZoomLevelsControl.prototype._bindZoomEvent = function () {
            var self = this;

            google.maps.event.addListener(this._map, 'zoom_changed', function () {
                self._updateUI();
            });
        };

        Demo.ZoomLevelsControl.prototype._bindLevelClick = function (bar, zoom) {
            var self = this;

            google.maps.event.addDomListener(bar, 'click', function () {
                self._map.setZoom(zoom);
            });
        };

        // TextWindow class
        //////////////////////////////////
        Demo.TextWindow = function (map) {
            this._map = map;
            this._window = null;
            this._text = null;
            this._position = null;
        };

        Demo.TextWindow.prototype = new google.maps.OverlayView();

        Demo.TextWindow.prototype.open = function (latlng, text) {
            if (this._window != null) this.close();

            this._text = text;
            this._position = latlng;

            this.setMap(this._map);
        };

        Demo.TextWindow.prototype.close = function () {
            this.setMap(null);
        };

        Demo.TextWindow.prototype.onAdd = function () {
            this._window = document.createElement('DIV');
            this._window.style.position = 'absolute';
            this._window.style.cursor = 'default';
            this._window.style.padding = '40px 20px 0px 20px';
            this._window.style.textAlign = 'center';
            this._window.style.fontFamily = 'Arial,sans-serif';
            this._window.style.fontWeight = 'bold';
            this._window.style.fontSize = '12px';
            this._window.style.width = '88px';
            this._window.style.height = '88px';
            this._window.style.background = 'url(' + Demo.Utils.GetImageUrl('window.png') + ')';
            this._window.innerHTML = this._text;

            this.getPanes().floatPane.appendChild(this._window);
        };

        Demo.TextWindow.prototype.draw = function () {
            var point = this.getProjection().fromLatLngToDivPixel(this._position);

            this._window.style.top = (parseInt(point.y) - 128) + 'px';
            this._window.style.left = (parseInt(point.x) - 110) + 'px';
        };

        Demo.TextWindow.prototype.onRemove = function () {
            this._window.parentNode.removeChild(this._window);
            this._window = null;
        };

        // Other
        //////////////////////////////////
        Demo.Utils = Demo.Utils || {};

        Demo.Utils.GetImageUrl = function (image) {
        	console.log("Get image url " + image);
            return Demo.ImagesBaseUrl + image;
        };

        Demo.Utils.SetOpacity = function (obj, opacity /* 0 to 100 */ ) {
            obj.style.opacity = opacity / 100;
            obj.style.filter = 'alpha(opacity=' + opacity + ')';
        };

        // Map creation
        //////////////////////////////////
        google.maps.event.addDomListener(window, 'load', function () {
        	setTimeout(function(){ 
        	console.log("Loaded");
        	document.getElementById('croft-map').innerHTML = "";
            var croftMap = new Demo.CroftMap(document.getElementById('croft-map'));
        	}, 500); 
        });


}]);