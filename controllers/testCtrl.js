angular.module('userApp').controller("testCtrl", ["$rootScope", "$scope", "$http", "$filter", "$translate", "ServerService", "$modal",
    function (rootScope, scope, http, filter, translate, ServerService, modal) {

        scope.msg = "PAIS user! " + new Date();

        scope.manual = function () {
            if (rootScope.getLanguage() == "en") {
                window.open("/newOrderManual_en.pdf");
            } else {
                window.open("/newOrderManual_rs.pdf");
            } 
        }

        scope.fillAllSensors = function () {
            var retArray = [];
             for (var i = scope.sensorTypes.length - 1; i >= 0; i--) {
                 var sensor = {
                    "type" : scope.sensorTypes[i].name,
                    "id" : parseInt(scope.sensorTypes[i].id),
                    "uom_id" : scope.getTypeUOMS(scope.sensorTypes[i].id)[0].id,
                    "min_value" : '',
                    "max_value" : '',
                    "checked" : true
                 };
                 retArray.push(sensor);
             };
             return retArray;  
        };

        scope.setHoverTitle = function () {
            if (rootScope.getLanguage() == "en") {
                $("#fromTooltip").tooltip({
                    title: "<h4><img src='../img/info.png' style='width:26px;' alt='Smiley'> Required date of commencement (of the service)</h4>",   
                    html: true, 
                });
                $("#toTooltip").tooltip({
                    title: "<h4><img src='../img/info.png' style='width:26px;' alt='Smiley'> Required completion date</h4>",   
                    html: true, 
                });   
            } else {
                $("#fromTooltip").tooltip({
                    title: "<h4><img src='../img/info.png' style='width:26px;' alt='Smiley'> Željeni datum početka servisa</h4>",   
                    html: true, 
                });
                $("#toTooltip").tooltip({
                    title: "<h4><img src='../img/info.png' style='width:26px;' alt='Smiley'> Željeni datum završetka</h4>",   
                    html: true, 
                });  

            }
        }

        scope.setHoverTitle();


        /*
         ORDER element.
         */
        scope.order = {
            "name": "",
            "description": "",
            "image_frequency_id": "",
            "imageTypes": [],
            "polygons": [],
            "stations": [],
            "start_date" : new Date(),
            "end_date" : new Date() 
        }

        scope.orderStations = [];

        scope.setStartDate = function () {
            scope.order.end_date.setTime(scope.order.start_date.getTime() + 30 * 24 * 60 * 60 * 1000);
        }

        scope.setStartDate();

        scope.setMultiselectIN = function () {
            if (rootScope.getLanguage() === 'en') {
                scope.msTranslate = {
                    'buttonDefaultText': 'Select',
                    'uncheckAll': 'Uncheck All',
                    'selectionCount': 'checked',
                    'selectionOf': '/',
                    'searchPlaceholder': 'Search...',
                    'checkAll': 'Check All',
                    'dynamicButtonTextSuffix': 'checked'
                }
            } else {
                scope.msTranslate = {
                    'buttonDefaultText': 'Izaberi',
                    'uncheckAll': 'Isključi sve',
                    'selectionCount': 'obeleženo',
                    'selectionOf': '/',
                    'searchPlaceholder': 'Pretraži...',
                    'checkAll': 'Obeleži sve',
                    'dynamicButtonTextSuffix': 'obeleženo'
                }
            }
        };


        scope.init = function () {
            scope.generalError = false;

            scope.orderNameInvalid = false;
            scope.orderImgTypeInvalid = false;
            scope.orderDescInvalid = false;

            scope.setMultiselectIN();
        }

        scope.init();



        scope.sensorTypes = [];

        scope.multiselectmodel = [];
        scope.multiselectdata = [];
        scope.multiselectsettings = {
            smartButtonMaxItems: 2,
        };

        scope.multiselectmodelSensor = [];
        scope.multiselectdataSensor = [];
        scope.multiselectsettings = {
            smartButtonMinItems: 1,
        };

        


        scope.validateName = function () {
            if (scope.order.name == undefined || scope.order.name.length < 3) {
                return false;
            } else {
                return true;
            }
        }

        scope.validatePolygons = function () {
            if (scope.order.polygons.length != 0 && scope.multiselectmodel.length == 0) {
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

        scope.validateUOMs = function () {
            for (var i = scope.order.stations.length - 1; i >= 0; i--) {
                for (var f = scope.order.stations[i].sensors.length - 1; f >= 0; f--) {
                    
                    if (scope.order.stations[i].sensors[f].uom_id == undefined ||
                    scope.order.stations[i].sensors[f].uom_id == "") {
                        return false;
                    }
                };
            };
            return true;
        }


        scope.injectToRootAndOpenEstimateModal = function () {


            scope.order.stations = [];

            for (var b = scope.orderStations.length - 1; b >= 0; b--) {
                var sensorStation = {
                    "latitude" : scope.orderStations[b].latitude,
                    "longitude" : scope.orderStations[b].longitude,
                    "description" : scope.orderStations[b].description,
                    "sensors" : []
                };
                for (var m = scope.orderStations[b].sensors.length - 1; m >= 0; m--) {
                    if (scope.orderStations[b].sensors[m].checked) {
                        var sensorSingle = {
                            "type_id": scope.orderStations[b].sensors[m].id,
                            "uom_id" : scope.orderStations[b].sensors[m].uom_id,
                            "description" : "",
                            "min_value" : scope.orderStations[b].sensors[m].min_value,
                            "max_value" : scope.orderStations[b].sensors[m].max_value
                        };
                        sensorStation.sensors.push(sensorSingle);
                    }
                };
                if (sensorStation.sensors.length == 0) {
                    alert("Sensor station must have at least one sensor selected.");
                    return;
                }
                scope.order.stations.push(sensorStation);
            };

            if (!scope.validateName()) {
                alert("Please enter order name. Order name must have at least 3 characters.");
                return;
            }

            if (!scope.validateDescription()) {
                alert("Order description must have maximum of 100 characters.");
                return;
            }

            if (!scope.validatePolygons()) {
                alert("You must select at least one image type.");
                return;
            }

            if (!scope.validateUOMs()) {
                alert("Please select Unit of measurement for all sensors.");
                return;
            }

            scope.order.imageTypes = [];
            for (var i = scope.multiselectmodel.length - 1; i >= 0; i--) {
                var add = true;
                for (var k = scope.order.imageTypes.length - 1; k >= 0; k--) {
                    if (scope.order.imageTypes[k].image_type_id == parseInt(scope.multiselectmodel[i].id)) {
                        add = false;
                    }
                };
                if (add) {
                    scope.order.imageTypes.push({
                        "image_type_id": parseInt(scope.multiselectmodel[i].id)
                    });
                }
            };
            scope.order.start_date.setTime(scope.order.start_date.getTime() - scope.order.start_date.getTimezoneOffset() * 60 * 1000);
            scope.order.end_date.setTime(scope.order.end_date.getTime() - scope.order.end_date.getTimezoneOffset() * 60 * 1000);


            scope.order.image_frequency_id = parseInt(scope.order.image_frequency_id);

            rootScope.estimateOrder = scope.order;
            rootScope.estimateSurface = scope.polygonSurfaceFixed;
            if (rootScope.estimateOrder.polygons.length == 0) {
                rootScope.estimateOrder.imageTypes = [];
                rootScope.estimateOrder.image_frequency_id = "";
            } else {
                for (var i = rootScope.estimateOrder.polygons.length - 1; i >= 0; i--) {
                    if (rootScope.estimateOrder.polygons[i].description == undefined || rootScope.estimateOrder.polygons[i].description == null) {
                        rootScope.estimateOrder.polygons[i].description = "";
                    }
                };
            }

            var estimateModalInstance = modal.open({
                animation: true,
                templateUrl: 'estimateModal.html',
                controller: 'EstimateModalInstanceCtrl',
                resolve: {
                    sensorTypes: function() {
                        return scope.sensorTypes;
                    },
                    imageTypes : function () {
                        return scope.imageTypesData;
                    },
                    frequencies : function () {
                        return scope.frequencies;
                    }
                }
            });


        }


        scope.onTimeSetFrom = function (newDate, oldDate)  {
            var now = new Date();
            if (scope.order.start_date.getTime() < now.getTime()) {
                scope.order.start_date.setTime(now.getTime());
            } else {
                scope.order.start_date.setTime(newDate.getTime());
            }
            if (scope.order.end_date.getTime() < scope.order.start_date.getTime()) {
                scope.order.end_date.setTime(newDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            }
        }

        scope.onTimeSetTo = function (newDate, oldDate)  {
            var now = new Date();
            scope.order.end_date.setTime(newDate.getTime());
            if (scope.order.end_date.getTime() < now.getTime() || scope.order.end_date.getTime() < scope.order.start_date.getTime()) {
                scope.order.end_date.setTime(scope.order.start_date.getTime() + 30 * 24 * 60 * 60 * 1000);
            } else {
                scope.order.end_date.setTime(newDate.getTime());
            }
        }

        scope.test = function () {
        }

        /*
         Method for pulling all image types from ServerService
         -> all image types are put in multiselect objects for multiselect dropdown component
         */
        scope.getImageTypes = ServerService.getImageTypes().then(function (data) {
            if (data) {
                scope.imageTypesData = data;
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].active == "1") {
                        var type = {
                            id: data[i].id,
                            label: data[i].name
                        };
                        scope.multiselectdata.push(type);
                        scope.multiselectmodel.push({
                            "id" : data[i].id
                        });
                    }
                }
                ;
            } else {
                rootScope.errorOccured();
            }
        }, function (reason) {
            rootScope.errorOccured();
        });

        /*
         Method for pulling all frequencies from ServerService
         */
        scope.getFrequencies = ServerService.getFrequencies().then(function (data) {
            if (data) {
                scope.order.image_frequency_id = data[0].id;
                scope.frequencies = data;
            } else {
                rootScope.errorOccured();
            }
        }, function (reason) {
            rootScope.errorOccured();
        });

        scope.reloadUOMS = function (sensor, type) {
            for (var i = scope.sensorTypes.length - 1; i >= 0; i--) {
                if (scope.sensorTypes[i].id == type) {
                    return scope.sensorTypes[i].uoms;
                }
            }
            ;
        };


        scope.getTypeUOMS = function (type) {
            for (var i = scope.sensorTypes.length - 1; i >= 0; i--) {
                if (scope.sensorTypes[i].id == type) {
                    return scope.sensorTypes[i].uoms;
                }
            };
        }

        /*
         Method for pulling all sensor types from ServerService
         */
        scope.getSensorTypes = ServerService.getSensorTypes().then(function (data) {
            if (data) {
                scope.sensorTypes = data;
            } else {
                rootScope.errorOccured();
            }
        }, function (reason) {
            rootScope.errorOccured();
        });




        /*
         Flags for showing result of estimation process.
         -> evaluated marks when evaluation process is finished
         -> evaluatedError marks error occured
         -> evaluationAvailable marks that result is available
         -> -> NOTE: rootScope
         */
        rootScope.evaluated = false;
        rootScope.evaluatedError = false;
        rootScope.evaluationAvailable = true;




        /*
         Two elements that sum total surface area in ha.
         */
        scope.polygonSurface = 0;
        scope.polygonSurfaceFixed = 0;

        /*
         Flags for showing and hiding panels
         */
        scope.polygonNotSelected = true;
        scope.markerNotSelected = true;

        scope.typeChange = function () {
            console.log(scope.sensors);
        }


        scope.estimate = function () {
            $('#warning').show();
        }

        /*
         Options and methods for gmaps settings
         */
        var mapOverlays = [],
            mapDataId = 'map-data',
            mapOverlayStyle = {
                fillColor: '#21CCCA',
                fillOpacity: 0.75,
                strokeWeight: 0.95
            };

        /*
         On page load setup map and bind listeners
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
            // NOTE: this is where you tell how map looks like
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
            google.maps.event.addDomListener(resetControl, 'click', function () {
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
                    //console.log(event);
                    //console.log(event.overlay.getPosition().lng());
                    //console.log(event.overlay.getPosition().lat());
                    mapOverlays.push(event.overlay);
                    var sensor = event.overlay.position;
                    var infowindow = new google.maps.InfoWindow({
                        content: "Sensor station (Senz. stanica) " + (scope.orderStations.length + 1)
                    });
                    infowindow.open(map, event.overlay);
                    google.maps.event.addListener(event.overlay, 'click', function () {
                        infowindow.open(map, event.overlay);
                    });
                    /*var sensorInfo = {
                        "latitude": event.overlay.getPosition().lat(),
                        "longitude": event.overlay.getPosition().lng(),
                        "description": "",
                        "uom_id": scope.sensorTypes[0].uoms[0].id,
                        "type_id": ""
                    };
                    scope.order.sensors.push(sensorInfo);
                    console.log("sensors " + scope.order.sensors.length);
                    console.log(angular.toJson(scope.order.sensors));*/
                    if (scope.markerNotSelected == true) {
                        scope.markerNotSelected = false;
                    }
                    var weatherStationInfo = {
                        "latitude": event.overlay.getPosition().lat(),
                        "longitude": event.overlay.getPosition().lng(),
                        "description": "",
                        "sensors" : scope.fillAllSensors()
                    };
                    scope.orderStations.push(weatherStationInfo);
                } else {
                    var paths = event.overlay.getPath();
                    var myCoordArray = event.overlay.toCapAreaArray();
                    mapOverlays.push(event.overlay);
                    var area = google.maps.geometry.spherical.computeArea(paths);
                    var polygon = area / 10000;
                    var polygonInfo = {
                        "coordinates": [],
                        "surface": 0
                    };
                    for (var i = myCoordArray.length - 1; i >= 0; i--) {
                        polygonInfo.coordinates.push(myCoordArray[i]);
                    }
                    scope.polygonSurface = scope.polygonSurface + polygon;
                    scope.polygonSurfaceFixed = scope.polygonSurface.toFixed(4);
                    polygonInfo.surface = polygon.round(4);
                    scope.order.polygons.push(polygonInfo);
                    if (scope.polygonNotSelected == true) {
                        scope.polygonNotSelected = false;
                    }
                    scope.setMultiselectIN();
                }
            });

        });

        /*
         Helper method for rounding up numbers to two decimals
         */
        Number.prototype.round = function (p) {
            p = p || 10;
            return parseFloat(this.toFixed(p));
        };

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
            scope.orderStations = [];
        }


        /**
         * Removes map overlays (global variable)
         *
         */
        function removeMapOverlays() {
            while (mapOverlays[0])
                mapOverlays.pop().setMap(null);
        }


        /**
         * Removes DOM elements with map data
         *
         */
        function removeMapData() {
            $('#' + mapDataId).empty()
        }


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
                success: function (data) {
                    var territories = [];
                    data.rows.forEach(function (element, index) {
                        territories.push(element.nombre);
                    });
                    callback(territories.toString());
                },
                error: function (error) {
                    callback(null, error);
                }
            });
        }

        /*
         Helper methods that extract data from polygon selected
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
                    "latitude": element.lat().toString(),
                    "longitude": element.lng().toString()
                }
                capArea.push(coord);
            });
            var start = this.getPath().getAt(0);
            return capArea;
        };

        /*
         Ne daj boza da nam krug zatreba
         */
        google.maps.Circle.prototype.toCapArea = function () {
            return this.getCenter().lat() + ',' + this.getCenter().lng() + ' ' + this.getRadius() / 1000;
        };


        google.maps.Polygon.prototype.toGeom = function () {
            var wkt = "ST_GeomFromText('POLYGON ((";
            this.getPath().forEach(function (element, index) {
                wkt += element.lng() + ' ' + element.lat() + ',';
            });
            var start = this.getPath().getAt(0);
            wkt += start.lng() + ' ' + start.lat();
            return wkt + "))', 4326)";
        };

        google.maps.Circle.prototype.toGeom = function () {
            var center = this.getCenter().lng() + ' ' + this.getCenter().lat();
            return "ST_Buffer(geography(ST_GeomFromText('POINT(" + center + ")', 4326)), " + this.getRadius() + ")";
        };


        /*
         MAP SETTINGS
         */
        scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8,
            polys: [],
            draw: undefined,
            refresh: false,
            options: [],
            events: []
        };
    }]);

angular.module('userApp').controller('EstimateModalInstanceCtrl', function ($scope, $modalInstance, $location, $modal, ServerService, $rootScope, sensorTypes, imageTypes, frequencies) {

    $scope.sensorTypes = sensorTypes;
    $scope.imageTypes = imageTypes;
    $scope.frequencies = frequencies;


    $scope.placingLoading = false;

    $scope.tof = function () {
        var lang = $rootScope.getLanguage();
        if (lang == "en") {
            window.open("/tof_en.pdf");
        } else {
            window.open("/tof_rs.pdf");
        }
    }

    $scope.getFrequencyName = function (freq_id) {
        for (var i = $scope.frequencies.length - 1; i >= 0; i--) {
            if ($scope.frequencies[i].id == freq_id) {
                return $scope.frequencies[i].name;
            }
        };
    }

    $scope.getSensorTypeName = function (type_id) {
        for (var i = $scope.sensorTypes.length - 1; i >= 0; i--) {
            if ($scope.sensorTypes[i].id == type_id) {
                return $scope.sensorTypes[i].name;
            }
        };
    }

    $scope.getUOMName = function (type_id, uom_id) {
        for (var i = $scope.sensorTypes.length - 1; i >= 0; i--) {
            if ($scope.sensorTypes[i].id == type_id) {
                for (var j = $scope.sensorTypes[i].uoms.length - 1; j >= 0; j--) {
                    if ($scope.sensorTypes[i].uoms[j].id == uom_id) {
                        return $scope.sensorTypes[i].uoms[j].name;
                    }
                };
            }
        };
    }

    $scope.getUOMSymbol = function (type_id, uom_id) {
        for (var i = $scope.sensorTypes.length - 1; i >= 0; i--) {
            if ($scope.sensorTypes[i].id == type_id) {
                for (var j = $scope.sensorTypes[i].uoms.length - 1; j >= 0; j--) {
                    if ($scope.sensorTypes[i].uoms[j].id == uom_id) {
                        return $scope.sensorTypes[i].uoms[j].symbol;
                    }
                };
            }
        };
    }

    $scope.getImageTypeName = function (image_type_id) {
        for (var i = $scope.imageTypes.length - 1; i >= 0; i--) {
            if ($scope.imageTypes[i].id == image_type_id) {
                return $scope.imageTypes[i].name;
            } 
        };
    }

    /*
     Flags for placing order status
     */
    $scope.orderPlaced = false;
    $scope.orderSuccess = false;

    $scope.agreeTos = false;
    /*
     Method for placing an order.
     NOTE: Order is now being backdroped from rootScope to scope.
     */
    $scope.placeOrder = function () {
        $scope.placingLoading = true;
        var orderToPlace = $rootScope.estimateOrder;
        ServerService.placeOrder($scope.clientId, orderToPlace).then(function (data) {
            if (data) {

                $scope.orderPlaced = true;
                $scope.orderSuccess = true;
            } else {
                $scope.orderSuccess = false;
            }
            $scope.placingLoading = false;
            $scope.showConfirmModal();
        }, function (reason) {
            $scope.orderSuccess = false;
            $scope.showConfirmModal();
        });

    }


    $scope.dismissModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.showAdditionModal = function (station, sensor) {
        var additionalSettingsModal = $modal.open({
            animation: true,
            templateUrl: 'additionalSensorSettingsModal.html',
            controller: 'SensorAddSettingsCtrl',
            resolve: {
                station: function() {
                    for (var i = $rootScope.estimateOrder.stations.length - 1; i >= 0; i--) {
                        if ($rootScope.estimateOrder.stations[i].latitude == station.latitude &&
                            $rootScope.estimateOrder.stations[i].longitude == station.longitude) {
                            return $rootScope.estimateOrder.stations[i];
                        }
                    }
                },
                sensor: function () {
                    return sensor;
                },
                sensorTypeName : function () {
                    return $scope.getSensorTypeName(sensor.type_id);
                },
                uomName : function () {
                    return $scope.getUOMName(sensor.type_id, sensor.uom_id);
                },
                uomSymbol : function () {
                    return $scope.getUOMSymbol(sensor.type_id, sensor.uom_id);
                }
            }
        });

        additionalSettingsModal.result.then(function (resultObject) {
            if (resultObject != null) {
                for (var y = $rootScope.estimateOrder.stations.length - 1; y >= 0; y--) {
                    if ($rootScope.estimateOrder.stations[y].latitude == resultObject.station.latitude &&
                        $rootScope.estimateOrder.stations[y].longitude == resultObject.station.longitude) {
                        for (var t = $rootScope.estimateOrder.stations[y].sensors.length - 1; t >= 0; t--) {
                            if ($rootScope.estimateOrder.stations[y].sensors[t].type_id == resultObject.sensor.type_id) {
                                $rootScope.estimateOrder.stations[y].sensors[t].description = resultObject.sensor.description;
                                $rootScope.estimateOrder.stations[y].sensors[t].min_value = resultObject.sensor.min_value;
                                $rootScope.estimateOrder.stations[y].sensors[t].max_value = resultObject.sensor.max_value;
                            }
                        };
                    }
                };
            }
        });

    }

    $scope.showConfirmModal = function(){
        var placeOrderModalInstance = $modal.open({
            animation: true,
            templateUrl: 'placeOrderModal.html',
            controller: 'PlaceOrderModalInstanceCtrl',
            resolve: {
                orderSuccess: function() {
                    return $scope.orderSuccess;
                },
                orderPlaced: function() {
                    return $scope.orderPlaced;
                }
            }
        });

        placeOrderModalInstance.result.then(function (cancelModal) {
            if(cancelModal == true){
                $scope.dismissModal();
            }
        } );
    }
});

angular.module('userApp').controller('PlaceOrderModalInstanceCtrl', function ($scope, $modalInstance, $location, orderSuccess, orderPlaced) {

    $scope.orderSuccess = orderSuccess;
    $scope.orderPlaced = orderPlaced;

    $scope.goToMyOrders = function () {
        $modalInstance.close(true);
    }

    $scope.dismissModal = function () {
        $modalInstance.dismiss('cancel');

    };
});


angular.module('userApp').controller('SensorAddSettingsCtrl', function ($scope, $modalInstance, $location, station, sensor, sensorTypeName, uomName, uomSymbol) {

    $scope.station = station;
    $scope.sensor = sensor;
    $scope.uomName = uomName;
    $scope.uomSymbol = uomSymbol;
    $scope.desc = $scope.sensor.description;
    $scope.alarm_min = $scope.sensor.min_value;
    $scope.alarm_max = $scope.sensor.max_value;
    $scope.sensorTypeName = sensorTypeName;
    

    $scope.save = function () {
        console.log("Save changes");
        $scope.sensor.description = $scope.desc;
        $scope.sensor.min_value = $scope.alarm_min;
        $scope.sensor.max_value = $scope.alarm_max;
        $modalInstance.close({
            "station" : $scope.station,
            "sensor" : $scope.sensor
        });
    };

    $scope.dismissModal = function () {
        $modalInstance.dismiss(null);
    };

    $scope.test = function () {
        alert("Just a test...");
    };

});