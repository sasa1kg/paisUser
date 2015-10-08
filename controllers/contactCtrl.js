angular.module('userApp').controller("contactCtrl", ["$scope", "$location", "$filter", "ServerService",  
	function (scope, location, filter, ServerService) {


	scope.mailToArray = [];

	ServerService.getAdministrators().then(function (data) {
                if (data) {
                	for (var i = data.length - 1; i >= 0; i--) {
                		scope.mailToArray.push({
                			mail:data[i].email, 
                			mailto: "mailto:" + data[i].email + "?Subject=Help"});
                	};
                   scope.administrators = data;
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
                scope.generalError = true;
    });

}]);