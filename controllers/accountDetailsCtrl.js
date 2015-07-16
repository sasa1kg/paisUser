angular.module('userApp').controller("accountDetailsCtrl", ["$scope", "$http", "$filter",  function (scope, http, filter) {

	console.log("accountDetailsCtrl!");
	scope.msg = "accountDetailsCtrl!";

	scope.name = "Marko";
	scope.lastname = "Markovic";
	scope.email = "marko@markovprovajder.rs";
	scope.address = "Bul. Cara Lazara 5";
	scope.postcode = "21000";
	scope.city = "Novi Sad";
	scope.phone = "+38163101101";
	scope.password = "nekipassword";
	scope.dob = "1/7/1960";


}]);