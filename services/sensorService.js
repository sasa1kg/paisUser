var SensorService = angular.module('SensorService', []).service('OrdersService', ['$http', function (http) {


	var sensor = {};

	this.setSensor = function (sensorToSet) {
		sensor = sensorToSet;
	}

	this.getSensor = function () {
		return sensor;
	}

}]);