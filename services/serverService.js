var ServerService = angular.module('ServerService', [])
	.service('ServerService', ["$q", "$http", function (q, http) {

	var serverurl = 'http://195.220.224.164/';

  this.user = "";


    /*-------------------------- USER OPERATIONS----------------------------*/

  this.updateClient = function (user) {
    var deffered = q.defer();
       console.log("updateClient " + JSON.stringify(user));
       http.put(serverurl + "pais/clients", user).
              success(function(data, status) {
                var result = JSON.stringify(data);
                var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log("Status OK " + status) ;
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }


	this.getClient = function (id) {
		 var deffered = q.defer();
    	 console.log("getClient " + id);
    	 http.get(serverurl + "pais/clients/" + id).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log("Status OK " + status) ;
                    console.log(JSON.stringify(data));
                    this.user = data;
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
    	 return deffered.promise;
	}



	this.registerUser = function (user) {
 		var deffered = q.defer();
    	console.log("registerUser " + user);
    	 http.post(serverurl + "pais/clients", user).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK");
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                    console.log("Error");
                   deffered.reject("Error");
              });
    	return deffered.promise;
	}

  this.getAccountTypes = function () {
      var deffered = q.defer();
      http.get(serverurl + "pais/clientTypes").
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }


  this.getCountries = function () {
      var deffered = q.defer();
      http.get(serverurl + "pais/countries").
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }



  /*-------------------------------------------------------------------------*/
  /*---------------------- SENSOR OPERATIONS --------------------------------*/

  this.getSensorTypes = function () {
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypes").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.getSensorType = function (id) {
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorType/" + id).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getSensorUOM = function (id) {
      var deffered = q.defer();
      http.get(serverurl + "pais/uoms/" + id).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getSensorTypeUOMs = function (sensorTypesId) {
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypes/" + sensorTypesId + "/uoms").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  /*-------------------------------------------------------------------------*/
  /*---------------------- ORDER OPERATIONS --------------------------------*/

  this.clientOrder = function (clientId, orderId) {
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders/" + orderId).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.clientOrders = function (clientId) {
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders").
              success(function(data, status) {
                console.log("clientOrders " + JSON.stringify(data));
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }
 

  this.clientOrderDetailed = function (clientId, orderId) {
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders/" + orderId + "/details").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.clientOrderSensors = function (clientId, orderId, sensorId) {
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders/" + orderId + "/sensors/" + sensorId).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }


  this.evaluateOrder = function (clientId, order) {
    var deffered = q.defer();
      console.log("evaluateOrder " + clientId);
       http.post(serverurl + "pais/clients/" + clientId+ "/evaluateOrder", order).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK");
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                    console.log("Error");
                   deffered.reject("Error");
              });
      return deffered.promise;
  }

  this.placeOrder = function (clientId, order) {
    var deffered = q.defer();
      console.log("evaluateOrder " + clientId);
       http.post(serverurl + "pais/clients/" + clientId+ "/orders", order).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK");
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                    console.log("Error");
                   deffered.reject("Error");
              });
      return deffered.promise;
  }


  /*-------------------------------------------------------------------------*/
  /*---------------------- DRON OPERATIONS --------------------------------*/
  this.getFrequencies = function () {
      var deffered = q.defer();
      http.get(serverurl + "pais/frequencies").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getImageTypes = function () {
      var deffered = q.defer();
      http.get(serverurl + "pais/imageTypes").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 






  /*-------------------------------------------------------------------------*/


    this.hello = function () {
    	return "Hello from service";
    };

    this.testPromise = function (id) {
        var testDef = q.defer();
        var myTimeoutId = setTimeout( function(){
            testDef.resolve("hello");
        }, 2000);
        return testDef.promise;
    }

}]);