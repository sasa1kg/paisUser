angular.module('userApp').controller("accountDetailsCtrl", ["$rootScope", "$scope", "$http", "$filter", "ServerService", "$modal",  
  function (rootScope, scope, http, filter, ServerService, modal) {


   scope.testUserId = 22;
   scope.updateSuccess = true;
   scope.updateDone = false;
   scope.retrieve = true;


   scope.getUser =	function () {
    ServerService.getClient(scope.testUserId).then(function (data) {
      if (data) {
         scope.user = data;
         scope.userUntouched = data;
       } else {
         rootScope.errorOccured();          
       }
     }, function(reason) {
        rootScope.errorOccured();         
     });
    }


    scope.getUser();

   scope.updateUser = function () {
    ServerService.updateClient(scope.user).then(function (data) {
      if (data) {
       scope.updateDone = true;
       scope.updateSuccess = true;
       scope.user = data;
     } else {
       scope.updateDone = true;
       scope.updateSuccess = false;
     }
   }, function(reason) {
     scope.updateDone = true;
     scope.updateSuccess = false;
   });
  }


  scope.changePassword = function () {
    var changePasswordInstance = modal.open({
      animation: true,
      templateUrl: 'changePasswordModal.html',
      controller: 'changePasswordInstanceCtrl',
      resolve: {
        client_id: function() {
          return scope.userUntouched.client_id;
        },
        oldPassword : function () {
          return scope.userUntouched.password;
        }
      }
      
    });

    changePasswordInstance.result.then(function (cancelModal) {
      if(cancelModal == true){
        scope.getUser();
      } else {
        scope.getUser();
      }
    });
  }



}]);


  angular.module('userApp').controller('changePasswordInstanceCtrl', function ($scope, $modalInstance, $location, ServerService, client_id, oldPassword) {

    $scope.oldPassword = oldPassword;
    $scope.client_id = client_id;

    $scope.errorCode = "";
    $scope.password= "";
    $scope.passwordRepeat = "";

    $scope.updateAccount = function () {
      $scope.errorCode = "";
      if ($scope.password == undefined || $scope.password.lenght < 4) {
        $scope.errorCode = 1;
        return false;
      }
      if ($scope.passwordRepeat == undefined || ($scope.password != $scope.passwordRepeat)) {
        $scope.errorCode = 2;
        return false;
      }
      $scope.passwordObject = {
        "oldPassword":$scope.oldPassword,
        "newPassword":$scope.password
      };
      ServerService.changePassword($scope.client_id, $scope.passwordObject).then(function (data) {
        if (data) {
         $scope.updateDone = true;
         $scope.updateSuccess = true;
         $modalInstance.close(true);
       } else {
         $scope.updateDone = true;
         $scope.updateSuccess = false;
         $modalInstance.close(false);
       }
     }, function(reason) {
      $scope.updateDone = true;
      $updateSuccess = false;
      $modalInstance.close(false);
    });
    }

    $scope.dismissModal = function () {
      $modalInstance.dismiss('cancel');
    };
  });