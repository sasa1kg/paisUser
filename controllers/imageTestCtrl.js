angular.module('userApp').controller("imageTestCtrl", ["$scope", "$http", 
	"$filter", "$routeParams", "ServerService", "$rootScope", "$modal", "$location", 
	function (scope, http, filter, rootParams, ServerService, rootScope, modal, location) {


$(document).ready(function() {
  $("#myPic").click(function(e) {
  var offset = $(this).offset();
  var relativeX = (e.pageX - offset.left) / e.target.clientWidth * 100;
  var relativeY = (e.pageY - offset.top) / e.target.clientHeight * 100;
  relativeX = Math.round(relativeX * 100) / 100;
  relativeY = Math.round(relativeY * 100) / 100;
  alert("PERC FROM THE LEFT " + relativeX+'% \nPERC FROM THE TOP : '+relativeY + '%');
  $(".position").val("afaf");
  });
});



}]);