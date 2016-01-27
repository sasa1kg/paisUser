angular.module('userApp').controller("sensorsCombinedRecordingsCtrl", ["$scope", "$http", 
	"$filter", "$routeParams", "ServerService", "$rootScope", "$modal",  
	function (scope, http, filter, rootParams, ServerService, rootScope, modal) {

	scope.sensors = [];
	scope.sensorsUntouched = [];
	scope.loadedOrders = 0;
	scope.selectedSensors = [];

	scope.results = [];
	scope.loadedSensors = -1;

	scope.loading = false;

	scope.client_id;

	scope.colors = ['#009933', '#0033CC', '#cc0033', '#9900cc', '#FF9933', '#0E0E0D', '#000066', '#FFFF00'];

  scope.init = function () {
        scope.dateFrom = new Date();
        scope.dateTo = new Date();
        scope.dateFrom.setTime(scope.dateFrom.getTime() - 3 * 24 * 60 * 60 * 1000);
  }
  scope.init();

  scope.localDate = new Date();

  scope.refactorDate = function (date) {
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var year = date.getFullYear();
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var hours = date.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;

  }

	scope.series = [];

	scope.getOrders = function () {
		ServerService.clientOrders(-1).then(function (data) {
                if (data) {
                   scope.accounts = data;
                   scope.client_id = data[0].client_id;
                   scope.getSelections();
                   angular.forEach(scope.accounts, function (account) {
                   		scope.getOrderDetailed(account.order_id);
                   });
                } else {

                }
	    }, function(reason) {
	  			
		});
	}


	scope.loadSelection = function (selection) {
		for (var t = scope.sensors.length - 1; t >= 0; t--) {
			scope.sensors.splice(t, 1);
		};
		for (var r = scope.sensorsUntouched.length - 1; r >= 0; r--) {
			scope.sensors.push(scope.sensorsUntouched[r]);
		};
		for (var i = scope.selectedSensors.length - 1; i >= 0; i--) {
			scope.selectedSensors.splice(i,1);
		};
		for (var j = selection.sensors.length - 1; j >= 0; j--) {
			scope.selectedSensors.push(selection.sensors[j]);
			for (var x = scope.sensors.length - 1; x >= 0; x--) {
				if (scope.sensors[x].sensor_id == selection.sensors[j].sensor_id && scope.sensors[x].order_id == selection.sensors[j].order_id
          && scope.sensors[x].station_id == selection.sensors[j].station_id) {
					scope.sensors.splice (x, 1);
				}
			};
		};
	}

	scope.removeSelection = function (name) {
		ServerService.removeSensorCombined(name);
		scope.getSelections();
	}


	scope.addToSelectedSensor = function () {
    scope.sensorToAdd = JSON.parse(scope.sensorToAdd);
		for (var i = scope.sensors.length - 1; i >= 0; i--) {
			if (scope.sensors[i].unique_id.sensor_id == scope.sensorToAdd.sensor_id && scope.sensors[i].unique_id.order_id == scope.sensorToAdd.order_id
          && scope.sensors[i].unique_id.station_id == scope.sensorToAdd.station_id) {
				var sensorExt = scope.sensors[i];
				sensorExt.color = scope.colors[scope.selectedSensors.length % 8];
				scope.selectedSensors.push(scope.sensors[i]);
				scope.sensors.splice(i, 1);
				if (scope.sensors.length > 0) {
					scope.sensorToAdd = scope.sensors[0].unique_id;
				}
				return;
			}
		};
	}

	scope.getSensorTypes = ServerService.getSensorTypes().then(function (data) {
                if (data) {
                   scope.sensorTypes = data;
                   scope.getOrders();
                } else {

                }
    }, function(reason) {
  			
	});

	scope.removeFromSelected = function (unique_id) {
		for (var i = scope.selectedSensors.length - 1; i >= 0; i--) {
			if (scope.selectedSensors[i].sensor_id == unique_id.sensor_id) {
				scope.sensors.push(scope.selectedSensors[i]);
				if (scope.sensors.length > 0) {
					scope.sensorToAdd = scope.sensors[0].unique_id;
				}
				scope.selectedSensors.splice(i, 1);
				return;
			}
		};
	}

	scope.getSelections = function () {
		scope.selections = ServerService.getSensorCombined(scope.client_id);
	}

	

	scope.getOrderDetailed = function (order_id) {
		ServerService.clientOrderDetailed(-1, order_id).then(function (data) {
                        if (data) {
                        	angular.forEach(data.stations, function(station) {
                            angular.forEach(station.sensors, function (sensor) {
                              	angular.forEach(scope.sensorTypes, function (type) {
                              			if (type.id == sensor.type_id) {
      	                        				sensor.type_name = type.name;
      	                        				sensor.order_name = data.name;
      	                        				sensor.order_id = order_id; 
      	                        		}
                              			angular.forEach(type.uoms, function (uom) {
      	                        			if (uom.id == sensor.uom_id){	
      	                        				sensor.uom_name = uom.name;
                                        sensor.uom_symbol = uom.symbol;
      	                        			}
                              			});
                            		});
                                sensor.unique_id = {
                                    sensor_id : sensor.sensor_id,
                                    station_id : station.station_id,
                                    order_id : sensor.order_id
                                };
                                sensor.station_id = station.station_id;
                            		scope.sensors.push(sensor);
                            		scope.sensorsUntouched.push(sensor);
                            });
                        	});
                        	scope.loadedOrders ++;
                        	if (scope.loadedOrders == scope.accounts.length) {
                        		scope.sensorToAdd = scope.sensors[0].unique_id;
                        	}
                        } else {
                            
                        }
		}, function(reason) {
		});
	};

	scope.loadData = function () {
		$("#containerhc").html("");
		scope.loadedSensors = 0;
		scope.series = [];
		scope.loading = true;
		for (var i = scope.selectedSensors.length - 1; i >= 0; i--) {
			scope.getSensor(scope.selectedSensors[i].order_id, 
				scope.selectedSensors[i].sensor_id, 
        scope.selectedSensors[i].station_id,
				scope.selectedSensors[i].uom_name,
				scope.selectedSensors[i].type_name,
				scope.selectedSensors[i].color);
		};
	}

	scope.getLang = function () {
        if (rootScope.getLanguage() === 'en') {
            scope.timeLbl = "TIME";
            scope.valueLbl = "VALUE";
        } else {
            scope.timeLbl = "VREME";
            scope.valueLbl = "VREDNOST";
        }
    }

    scope.getLang();

    scope.getSensor = function (orderId, sensorId, station_id, uom_name, type_name, sen_color) {
    	 ServerService.getSensorResults(orderId, sensorId, station_id, {
                                "from" : scope.refactorDate(scope.dateFrom),
                                "to" : scope.refactorDate(scope.dateTo)
        }).then(function (data2) {
				                if (data2) {

				                	var series = { 
				                		"name" : type_name + " [" + uom_name + "]",
				                		"data" : [],
				                		
							            "color": sen_color,
							            "fillOpacity": 0.4
							            
				                	};

				                	scope.minimum = parseFloat(data2[0].value);
				                	scope.maximum = parseFloat(data2[0].value);
				                	for (var i = data2.length - 1; i >= 0; i--) {

				                		var single_point = [];
			                            single_point.push(data2[i].time - scope.localDate.getTimezoneOffset() * 60 * 1000);
			                            single_point.push(parseFloat(data2[i].value));
				                		series.data.push(single_point);

				                	 }

				                	 scope.series.push(series);

				                	 scope.loadedSensors ++;
				                	 if (scope.loadedSensors == scope.selectedSensors.length) {
				                	 	scope.loading = false;
				                	 	scope.rawChart(scope.series, scope.valueLbl);
				                	 }
                				} else {
                            scope.loadedSensors ++;
		                   			//scope.generalError = true;
		               			}
		               		}, function(reason) {
                         scope.loadedSensors ++;
							});
    }

    scope.options = {
            chart: {
                type: 'lineChart',
                height: 600,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: scope.timeLbl,
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%d/%m/%y %H:%M')(new Date(d))
                    },
      				staggerLabels: true
                },
                yAxis: {
                    axisLabel: scope.valueLbl,
                    tickFormat: function (d){
                        return d3.format(',.2f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            }
        };


   scope.rawChart = function (series_obj, unit) {
     scope.chart = $('#containerhc').highcharts({
        chart: {
            type: 'area',
            zoomType: 'x',
		      plotBackgroundColor: 'rgba(255, 255, 255, .9)',
		      plotShadow: true
        },
        exporting: {
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: false
                        }
                    }
                }
            },
            scale: 1,
            fallbackToExportServer: false
        },
        title: {
            text: 'Sensor Readings'
        },
        tooltip: {
            formatter: function() {
                return  '<b>' + this.series.name +'</b><br/>' +
                    Highcharts.dateFormat('%e.%b %Y, %H:%M:%S',
                                          this.x)
                + ' <br/><b> ' + this.y + "</b>";
            }
        },
        plotOptions: {
            series: {
                fillOpacity: 0.5
            }
        },
        xAxis: {
          gridLineWidth: 1,
          lineColor: '#000',
          tickColor: '#000',
            type: 'datetime',
             dateTimeLabelFormats: {
               day: '%e. %b \'%y %H:%M'
             }
        },
        yAxis: {
          minorTickInterval: 'auto',
          lineColor: '#000',
          lineWidth: 1,
          tickWidth: 1,
          tickColor: '#000',
            title: {
                text: unit
            }
        },
        plotOptions: {
                area: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
        },
        series: series_obj

        /*[{
            name: data.name,
            data: data.data
        }]*/
    });
  }

  /*scope.rawChart = function (series_obj, unit) {
     $('#containerhc').empty();
     scope.chart = $('#containerhc').highcharts({
        chart: {
            type: 'area',
            zoomType: 'x',
          plotBackgroundColor: 'rgba(255, 255, 255, .9)',
          plotShadow: true,
          plotBorderWidth: 1
        },
        title: {
            text: 'Sensors Readings'
        },
        xAxis: {
          gridLineWidth: 1,
          lineColor: '#000',
          tickColor: '#000',
            type: 'datetime',
             dateTimeLabelFormats: {
               day: '%e. %b \'%y %H:%M:%S'
             }
        },
        yAxis: {
          minorTickInterval: 'auto',
          lineColor: '#000',
          lineWidth: 1,
          tickWidth: 1,
          tickColor: '#000',
            title: {
                text: unit
            },
        },
        plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
        },
        series: series_obj
    });
  }*/

   scope.saveSelectionDialog = function () {
    var saveSelectionInstance = modal.open({
      animation: true,
      templateUrl: 'saveSelection.html',
      controller: 'saveSelectionCtrl',
      resolve: {
        selectedSensors: function() {
          return {
          	"sensors" : scope.selectedSensors,
          	"client_id" : scope.client_id
          };
        }
      }
      
    });

    saveSelectionInstance.result.then(function (cancelModal) {
      if(cancelModal == true){
        scope.getSelections();
      }
    });
  }


  scope.showStats = function (unique_id) {
    var sensorToShow = {};
    for (var i = scope.selectedSensors.length - 1; i >= 0; i--) {
      if (unique_id.sensor_id == scope.selectedSensors[i].sensor_id && unique_id.order_id == scope.selectedSensors[i].order_id
        && unique_id.station_id == scope.selectedSensors[i].station_id) {
        sensorToShow = scope.selectedSensors[i];
      }
    };
    var sensorStatsInstance = modal.open({
      animation: true,
      templateUrl: 'sensorStats.html',
      controller: 'combinedStatsCtrl',
      resolve: {
        selectedSensor: function() {
          return {
            "selectedSensor" : sensorToShow
          };
        },
        timeObject : function () {
          return {
              "timeObject" : {
                "from" : scope.refactorDate(scope.dateFrom),
                "to" : scope.refactorDate(scope.dateTo)
              }
          };
        }
      }
      
    });
  }



}]);



  angular.module('userApp').controller('saveSelectionCtrl', function ($scope, $modalInstance, $location, ServerService, selectedSensors) {

    $scope.sensors = {
    	"client_id" : selectedSensors.client_id,
    	"name" : "",
    	"sensors": selectedSensors.sensors
    };

    $scope.saveSelection = function () {
    	ServerService.setSensorCombined($scope.sensors);
    	$modalInstance.close(true);
    }
    
    $scope.dismissModal = function () {
      $modalInstance.dismiss('cancel');
    };
  });



  angular.module('userApp').controller('combinedStatsCtrl', function ($scope, $modalInstance, $location, ServerService, selectedSensor, timeObject) {

    $scope.selectedSensor = selectedSensor;
    $scope.fromDate = timeObject.timeObject.from;
    $scope.toDate = timeObject.timeObject.to;

    $scope.selectedSensor.selectedSensor.stats = null;
    $scope.loading = true;

        ServerService.getSensorStatistics($scope.selectedSensor.selectedSensor.order_id, $scope.selectedSensor.selectedSensor.order_id, $scope.selectedSensor.selectedSensor.station_id, timeObject.timeObject)
        .then(function (data) {
            if (data) {
                $scope.selectedSensor.selectedSensor.stats = data;
                $scope.loading = false;
            } else {
              $scope.loading = false;
            }
        }, function(reason) {
            $scope.loading = false;
        });


    $scope.saveSelection = function () {
      $modalInstance.close(true);
    }
    
    $scope.dismissModal = function () {
      $modalInstance.dismiss('cancel');
    };
  });
