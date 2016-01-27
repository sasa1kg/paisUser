angular.module('userApp').controller("contactCtrl", ["$scope", "$location", "$filter", "ServerService",  
	function (scope, location, filter, ServerService) {


	scope.mailToArray = [];

    
    
    ServerService.getAdministratorsMails().then(function (data) {
                if (data) {
                    if (data.length > 0) {
                        scope.mailToArray.push({
                            mail:data[0].email, 
                            mailto: "mailto:" + data[0].email + "?Subject=Help"});
                    }
                } else {
                   scope.generalError = true;
                }
    }, function(reason) {
                scope.generalError = true;
    });
    

}]);