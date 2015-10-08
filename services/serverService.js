var ServerService = angular.module('ServerService', [])
	.service('ServerService', ["$q", "$http", "$location", 'localStorageService', 
    function (q, http, location, localStorageService) {

	var serverurl = 'http://195.220.224.164/';
  var user = "";

    /*-------------------------- LOCAL STORAGE ----------------------------*/

  var putUserInStorage = function (user) {
    localStorageService.set("userObject", user);
  }

  this.clearUserInStorage = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
              localStorageService.remove(keys[i]);
        };
  }

  var getUserInStorage = function () {
    var keys = localStorageService.keys();
    if (keys.length == 0) {
      return null;
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "userObject") {
        var userObj = localStorageService.get(keys[i]);
        return userObj;
      }
    };
    return null;
  }

  this.getUserInStorage = function () {
    var keys = localStorageService.keys();
    if (keys.length == 0) {
      return null;
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "userObject") {
        var userObj = localStorageService.get(keys[i]);
        return userObj;
      }
    };
    return null;
  }

    /*-------------------------- USER OPERATIONS----------------------------*/

  this.login = function (object) {
      var deffered = q.defer();
      http.post(serverurl + "pais/clients/login", object).
              success(function(data, status) {
                if (status == 200) {
                      putUserInStorage(data);
                      deffered.resolve(true);
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

  this.updateClient = function (user) {
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
    var deffered = q.defer();
       console.log("updateClient " + JSON.stringify(user));
       http.put(serverurl + "pais/clients", user).
              success(function(data, status) {
                var result = JSON.stringify(data);
                var dataJSON = JSON.parse(result);
                if (status == 200) {
                    putUserInStorage(data);
                    deffered.resolve(data);
                } else {
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.activateAccount = function (user) {
    var deffered = q.defer();
       console.log("updateClient " + JSON.stringify(user));
       http.put(serverurl + "pais/clients", user).
              success(function(data, status) {
                var result = JSON.stringify(data);
                var dataJSON = JSON.parse(result);
                if (status == 200) {
                    putUserInStorage(data);
                    deffered.resolve(data);
                } else {
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.getUserForActivatingAccount = function (user) {
    var deffered = q.defer();
       http.get(serverurl + "pais/clients/" + user).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log(JSON.stringify(data));
                    putUserInStorage(data);
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

  this.getAdministrators = function () {
    var deffered = q.defer();
       http.get(serverurl + "pais/administrators").
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


	this.getClient = function (id) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
		 var deffered = q.defer();
    	 http.get(serverurl + "pais/clients/" + userLS.id).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log(JSON.stringify(data));
                    putUserInStorage(data);
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
                    putUserInStorage(data);
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
      http.get(serverurl + "pais/sensorTypesDetailed").
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
      http.get(serverurl + "pais/sensorTypes/" + id).
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

    this.getSensorResults = function (orderId, sensorId, resultObject) {
      var userLS = getUserInStorage();
      var deffered = q.defer();
      http.post(serverurl + "pais/clients/" + userLS.id + "/orders/"+ orderId +"/results/sensors/" + sensorId, resultObject).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Received 200");
                    deffered.resolve(data);
                } else if (status == 404) {
                    console.log("Received 404");
                    deffered.reject("NA");
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
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.clientOrders = function (clientId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                   deffered.reject("Error");
              });
       return deffered.promise;
  }
 

  this.clientOrderDetailed = function (clientId, orderId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId + "/details").
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
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId + "/sensors/" + sensorId).
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
    var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
    var deffered = q.defer();
      console.log("evaluateOrder " + clientId);
       http.post(serverurl + "pais/clients/" + userLS.id + "/evaluateOrder", order).
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
    var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
    var deffered = q.defer();
      console.log("evaluateOrder " + user);
       http.post(serverurl + "pais/clients/" + userLS.id + "/orders", order).
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