angular.module('userApp').controller("sensorReadingsCtrl", ["$scope", "$http", "$filter", "$routeParams",   function (scope, http, filter, rootParams) {

	console.log("Sensor Readings! " + rootParams.id);
	scope.msg = "Sensor Readings Here";

	scope.sensorId = rootParams.id;

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


	scope.data3 = function () {
			var sin = [];
			var sin2 = [];
			var cos = [];
			var temp = [];
			var moist = [];
		    //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            
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
        	

            return [
                {
                    values: temp,
                    key: 'Temperatura',
                    color: '#2ca02c'
                },
                {
                    values: moist,
                    key: 'Vlaznost',
                    color: '#7777ff'
                }
            ];

	};

	scope.data = {
		series: ['Temperatura [Celzijus]', 'Vlažnost[%]'],
		data: [
			{
				x: "1/7/2015",
				y: [31, 45]
			},
			{
				x: "2/7/2015",
				y: [32, 55]
			},
			{
				x: "3/7/2015",
				y: [33, 51]
			},
			{
				x: "4/7/2015",
				y: [26, 71]
			},
			{
				x: "5/7/2015",
				y: [28, 49]
			},
		]
	}


	scope.data2 = {
		series: ['Keyboards', 'Laptops', 'TVs'],
		data: [{
			x: "Sales",
			y: [100, 500, 0],
			tooltip: "this is tooltip"
		}, {
			x: "Income",
			y: [300, 100, 100]
		}, {
			x: "Expense",
			y: [351, 50, 25]
		}]
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