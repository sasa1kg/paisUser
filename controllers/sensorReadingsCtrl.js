
angular.module('userApp').controller("sensorReadingsCtrl", ["$scope", "$http", 
	"$filter", "$routeParams", "ServerService",  
	function (scope, http, filter, rootParams, ServerService) {


	console.log("Sensor Readings! " + rootParams.id);
	console.log("Sensor Readings! " + rootParams.client_id);
	console.log("Sensor Readings! " + rootParams.order_id);
	scope.msg = "Sensor Readings Here";

	scope.sensorId = rootParams.id;
	scope.clientId = rootParams.client_id;
	scope.orderId = rootParams.order_id;

	scope.dateFrom = "";
	scope.dateTo = "";

	scope.hours = [];
	scope.minutes = [];
	scope.init = function () {
		for (var i = 23; i >= 0; i--) {
			var iDisplay;
			if (i<10) {
				iDisplay = "0" + i;
			} else {
				iDisplay = "" + i;
			}
			scope.hours.push({
				value: i,
				display: iDisplay + " h"
			});
		};
		for (var i = 59; i >= 0; i--) {
			var iDisplayMin;
			if (i<10) {
				iDisplayMin = "0" + i;
			} else {
				iDisplayMin = "" + i;
			}
			scope.minutes.push({
				value: i,
				display: iDisplayMin + " min"
			});
		};
	}
	scope.init();



	//alert(new Date());

	scope.getSensor = function () {
		ServerService.clientOrderSensors(scope.clientId, scope.orderId, scope.sensorId).then(function (data) {
                if (data) {
                	scope.sensor = data;
                	ServerService.getSensorType(data.type_id).then(function (data1) {
                		if (data1) {
                			scope.sensorType = data1;
                			ServerService.getSensorResults(scope.orderId, scope.sensorId).then(function (data2) {
				                if (data2) {
				                	
				                	for (var i = data2.length - 1; i >= 0; i--) {
				                	 	scope.results[0].values.push({
							            	x: new Date(data2[i].time),
							            	y: data2[i].value
							            });
							            
							            
				                	 }; 

				 					scope.getOUM();
                				} else {
		                   			scope.generalError = true;
		               			}
		               		}, function(reason) {
		               			if (reason == "NA") {
		               				alert("Sensor is not active");
		               			} else {
		  							scope.generalError = true;
		  						}
							});

                		//************
                		} else {
                   			scope.generalError = true;
               			}
               		}, function(reason) {
  						scope.generalError = true;
					});
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
  				scope.generalError = true;
	});
	};


	scope.getOUM = function () {
		ServerService.getSensorUOM(scope.sensor.uom_id).then(function (data) {
			if (data) {
				scope.results[0].key = data.name;
			}
		}, function(reason) {
  			scope.generalError = true;
		});

	}


	scope.getSensor();


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
                    axisLabel: 'Vreme',
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%m/%d/%y %H:%M')(new Date(d))
                    },
      				staggerLabels: true
                },
                yAxis: {
                    axisLabel: 'Vrednost',
                    tickFormat: function (d){
                        return d3.format(',.1f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            }
        };

      
    scope.results = [{
					values: [],
					key: '',
					color: '#2ca02c'
					}];
	scope.data3 = function () {
			scope.results = [];  
			var temp = [];
			var moist = [];

            
	            temp.push({
	            	x: new Date("1/07/2015 10:10"),
	            	y: 31
	            });
	            temp.push({
	            	x: new Date("1/07/2015 10:15"),
	            	y: 33
	            });
	            temp.push({
	            	x: new Date("1/07/2015 10:20"),
	            	y: 26
	            });
	           	moist.push({
	            	x: new Date("1/07/2015 10:10"),
	            	y: 45
	            });
	            moist.push({
	            	x: new Date("1/07/2015 10:15"),
	            	y: 55
	            });
	            moist.push({
	            	x: new Date("1/07/2015 10:20"),
	            	y: 66
	            });
        	
        	ServerService.getSensorResults(scope.orderId, scope.sensorId).then(function (data2) {
				                if (data2) {
				                	alert(data2.length);
				                	var resultArray = [];
				                	for (var i = data2.length - 1; i >= 0; i--) {
				                	 	scope.results.push({
							            	x: data2[i].time,
							            	y: data2[i].value
							            });

				                	 }; 

                				} else {
		                   			scope.generalError = true;
		               			}
		               		}, function(reason) {
		               			if (reason == "NA") {
		               				alert("Sensor is not active");
		               			} else {
		  							scope.generalError = true;
		  						}
							});
				return [
					{
					values: temp,
					key: 'Temperatura',
					color: '#2ca02c'
					}
				];
           

	};

	scope.data = {
		series: ['Temperatura [Celzijus]', 'Vlažnost[%]'],
		data: [
			{
				x: "1/7/2015 20:00",
				y: [31, 45]
			},
			{
				x: "2/7/2015 10:00",
				y: [32, 55]
			},
			{
				x: "3/7/2015 13:15",
				y: [33, 51]
			},
			{
				x: "4/7/2015 16:07",
				y: [26, 71]
			},
			{
				x: "5/7/2015 21:02",
				y: [28, 49]
			},
		]
	}


	scope.chartType = 'line';

	scope.config2 = {
		labels: false,
		legend: {
			display: true,
			htmlEnabled: true,
			position: 'right'
		},
		lineLegend: 'lineEnd'
	}



}]);