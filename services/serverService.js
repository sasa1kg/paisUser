var ServerService = angular.module('ServerService', [])
	.service('ServerService', ["$q", "$http", "$location", 'localStorageService', 
    function (q, http, location, localStorageService) {

	var serverurl = 'http://195.220.224.164/PEP/';
  var user = "";

    /*-------------------------- LOCAL STORAGE ----------------------------*/



  this.registerLanguage = function (lang) {
    localStorageService.set("paisLang", lang);
  } 

  this.getRegisteredLanguage = function (lang) {
     var keys = localStorageService.keys();
    if (keys.length == 0) {
      return null;
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "paisLang") {
        var langObj = localStorageService.get(keys[i]);
        return langObj;
      }
    };
    return null;
  }  

  var putUserInStorage = function (user) {
    localStorageService.set("userObject", user);
  }

  this.putUserInStorage = function (user) {
    localStorageService.set("userObject", user);
  }


  var clearUserInStorage = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
           if (keys[i] == "userObject") {
              localStorageService.remove(keys[i]);
          }
        };
  }

  this.clearUserInStorage = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
           if (keys[i] == "userObject") {
              localStorageService.remove(keys[i]);
          }
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

  this.setSensorCombined = function (selectedSensorsArray) {
    var keys = localStorageService.keys();
    var added = false;
    var userObjSens = [];
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "userObject_sensors") {
        userObjSens = localStorageService.get(keys[i]);
        userObjSens.push(selectedSensorsArray);
        added = true;
      }
    };
    if (!added) {
      userObjSens.push(selectedSensorsArray);
    }
    localStorageService.set("userObject_sensors", userObjSens);
  }

  this.getSensorCombined = function (client_id) {
    var keys = localStorageService.keys();
    if (keys.length == 0) {
      return null;
    }
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "userObject_sensors") {
        var retArray = [];
        var userObjSens = localStorageService.get(keys[i]);
        for (var i = userObjSens.length - 1; i >= 0; i--) {
          if (userObjSens[i].client_id == client_id) {
            retArray.push(userObjSens[i]);
          }
        };
        return retArray;
      }
    };
    return null;
  }

  this.removeSensorCombined = function (name) {
    var keys = localStorageService.keys();
    if (keys.length == 0) {
      return;
    }
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "userObject_sensors") {
        var userObjSens = localStorageService.get(keys[i]);
        for (var i = userObjSens.length - 1; i >= 0; i--) {
          if (userObjSens[i].name == name) {
            userObjSens.splice(i, 1);
            localStorageService.set("userObject_sensors", userObjSens);
            return;
          }
        };
      }
    };
  }

    /*-------------------------- USER OPERATIONS----------------------------*/

  this.login = function (object) {
      var deffered = q.defer();
      http.post(serverurl + "pais/clients/login", object).
              success(function(data, status) {
                if (status == 200) {
                      deffered.resolve(true);
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

  this.updateClient = function (user) {
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
    var deffered = q.defer();
       console.log("updateClient " + JSON.stringify(user));
       http.put(serverurl + "pais/clients", user, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                var result = JSON.stringify(data);
                var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   location.path('/login?status=expired');
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

  this.activateAccount = function (client_id) {
    var userLS = getUserInStorage();
    var token = "";
     if (userLS != null) {
        token = userLS.token;
      }
    var deffered = q.defer();
       console.log("updateClient " + JSON.stringify(user));
       http.post(serverurl + "pais/clients/"  +  client_id + "/activate", {}, {
        headers: {'X-Auth-Token': token}
       }).success(function(data, status) {
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


  this.changePassword = function (client_id, passwordObj) {
    var userLS = getUserInStorage();
    var token = "";
     if (userLS != null) {
        token = userLS.token;
      }
    var deffered = q.defer();
       http.put(serverurl + "pais/clients/"  +  userLS.id + "/changePassword", passwordObj, {
        headers: {'X-Auth-Token': token}
       }).success(function(data, status) {
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

  this.getUserForActivatingAccount = function (user) {
    var deffered = q.defer();
       http.get(serverurl + "pais/clients/" + user, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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

  this.getAdministratorsMails = function () {
    var userLS = getUserInStorage();
    var token = "";
    if (userLS != null) {
      token = userLS.token;
    }
    var deffered = q.defer();
       http.get(serverurl + "pais/contactmails/administrators", {
        headers: {'X-Auth-Token': token}
       }).success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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

  this.testHeader = function () {
    var res = getToken();
    var deffered = q.defer();
       http.get("http://httpbin.org/get", {
        headers: {'X-Auth-Token': userLS.token}
       }).success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    alert(angular.toJson(data.headers));
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
    	 http.get(serverurl + "pais/clients/" + userLS.id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
    var userLS = getUserInStorage();
    var token = "";
     if (userLS != null) {
        token = userLS.token;
      }
    	 http.post(serverurl + "pais/clients", user, {
        headers: {'X-Auth-Token': token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
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
    var userLS = getUserInStorage();
    var locTok = "";
    if (userLS == null || userLS == undefined) {
      locTok = "";
    } else {
      locTok = userLS.token;
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/clientTypes", {
        headers: {'X-Auth-Token': locTok}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
    var userLS = getUserInStorage();
    var locTok = "";
    if (userLS == null || userLS == undefined) {
      locTok = "";
    } else {
      locTok = userLS.token;
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/countries", {
        headers: {'X-Auth-Token': locTok}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
        var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypesDetailed", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
        var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypes/" + id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
        var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/uoms/" + id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
        var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypes/" + sensorTypesId + "/uoms", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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

    this.getSensorResults = function (orderId, sensorId, stationId, resultObject) {
      var userLS = getUserInStorage();
      var deffered = q.defer();
      http.post(serverurl + "pais/clients/" + userLS.id + "/orders/"+ orderId + "/stations/" + stationId + "/resultsForInterval/sensors/" + sensorId, resultObject, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Received 200");
                    deffered.resolve(data);
                } else if (status == 404) {
                    console.log("Received 404");
                    deffered.reject("NA");
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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


  this.getSensorStatistics = function (orderId, sensorId, stationId, resultObject) {
      var userLS = getUserInStorage();
      var deffered = q.defer();
      http.post(serverurl + "pais/clients/" + userLS.id + "/orders/"+ orderId + "/stations/" + stationId +"/resultsForInterval/sensors/" + sensorId + "/statistics", resultObject, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Received 200");
                    deffered.resolve(data);
                } else if (status == 404) {
                    console.log("Received 404");
                    deffered.reject("NA");
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
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
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
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
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId + "/details", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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

  this.clientOrderImages = function (clientId, orderId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId + "/images", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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

  this.clientOrderSensors = function (clientId, orderId, stationId, sensorId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/" + orderId + "/stations/" + stationId + "/sensors/" + sensorId, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
       http.post(serverurl + "pais/clients/" + userLS.id + "/evaluateOrder", order, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
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
       http.post(serverurl + "pais/clients/" + userLS.id + "/orders", order, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                    console.log("Error");
                   deffered.reject("Error");
              });
      return deffered.promise;
  }

    this.getKMLs = function (clientId, orderId) {
      var userLS = getUserInStorage();
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + userLS.id + "/orders/"+ orderId +"/klms", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Received 200");
                    deffered.resolve(data);
                } else if (status == 404) {
                    console.log("Received 404");
                    deffered.reject("NA");
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
  /*---------------------- DRON OPERATIONS --------------------------------*/
  this.getFrequencies = function () {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/frequencies", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/imageTypes", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
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