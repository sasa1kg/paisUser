angular.module('userApp').controller("chartsTestCtrl", ["$scope", "$http", 
	"$filter", "$routeParams", "ServerService", "$rootScope", "$modal", "$location", 
	function (scope, http, filter, rootParams, ServerService, rootScope, modal, location) {




  //alert((location.search()).code);


  /*scope.testMe = function () {
    ServerService.testHeader().then(function (data) {
        if (data) {
         //alert(angular.toJson(data));
        } else {
          alert("Error occured.");
        }
      }, function(reason) {
        alert("Error occured.");
      });
  }

  scope.testMe();*/


  scope.loading = true;

  scope.selectedSensors = [
      {
        "sensor_id" : 0,
        "order_id" : 0,
        "type" : "Air temperature",
        "type_id" : 0,
        "description" : "Negde u dvoristu",
        "color" : "#009933"
      },
      {
        "sensor_id" : 1,
        "order_id" : 0,
        "type" : "Air humidity",
        "type_id" : 1,
        "description" : "Ovo je moj opis",
        "color" : "#0033CC"
      },
      {
        "sensor_id" : 2,
        "order_id" : 2,
        "type" : "Soil temperature",
        "type_id" : 0,
        "description" : "Opis malo duzi malo duzi malo duzi malo duzi malo duzi malo duzi malo jos malo jos malo jos",
        "color" : "#FF9933"
      }
    ];

  scope.sensorStats = function (sensor_id, order_id) {
    var sensorToShow = {};
    for (var i = scope.selectedSensors.length - 1; i >= 0; i--) {
      if (sensor_id == scope.selectedSensors[i].sensor_id && order_id == scope.selectedSensors[i].order_id) {
        sensorToShow = scope.selectedSensors[i];
      }
    };
    var sensorStatsInstance = modal.open({
      animation: true,
      templateUrl: 'sensorStats.html',
      controller: 'statsCtrl',
      resolve: {
        selectedSensor: function() {
          return {
            "selectedSensor" : sensorToShow
          };
        }
      }
      
    });
  }

  scope.testHttp = function () {
      http.get("http://server.cors-api.appspot.com/server?id=9938204&enable=true&status=200&credentials=false&methods=GET%2C%20POST").
              success(function(data, status) {
                alert("Success");
                
              }).
              error(function(data, status) {
                   alert("error");
              });
  }

}]);

  angular.module('userApp').controller('statsCtrl', function ($scope, $modalInstance, $location, ServerService, selectedSensor) {

    $scope.selectedSensor = selectedSensor;

    $scope.selectedSensor.selectedSensor.stats = {};

    $scope.saveSelection = function () {
      $modalInstance.close(true);
    }
    
    $scope.dismissModal = function () {
      $modalInstance.dismiss('cancel');
    };
  });