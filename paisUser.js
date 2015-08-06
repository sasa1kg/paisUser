var userApp = angular.module("userApp", ['ngRoute', 'ngCookies', 
	'angularjs-dropdown-multiselect', 'angularCharts', 
	'ngMagnify', 'nvd3', 'OrdersService', 'ngSanitize','pascalprecht.translate']);


userApp.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://srv*.assets.example.com/**'
  ]);
});


userApp.config(function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.translations('en', {
      NEW_ORDER: 'New order',
      MY_ORDERS: 'My orders',
      MY_RESULTS: 'Images and sensors',
      MY_PROFILE: 'My profile',
      EXIT : 'Exit',
      ORDER : 'Order',
      NAME_ORDER : 'Order name',
      IMAGE_SETTINGS : 'Image settings',
      NO_TERITORIES: 'Number of selected teritorries:',
      SURFACE: 'Selected surface in ha:',
      IMAGE_TYPES: 'Image types:',
      IMAGE_START: 'Start of image taking:',
      IMAGE_END: 'End of image taking:',
      IMAGE_FREQ: 'Image frequency:',
      SENSOR_SETTINGS: 'Sensor settings',
      NO_SENSORS: 'Number of selected sensors'
    })
    .translations('rs', {
      NEW_ORDER: 'Nova porudžbina',
      MY_ORDERS: 'Moje porudžbine',
      MY_RESULTS: 'Snimanja i senzori',
      MY_PROFILE: 'Moji podaci',
      EXIT : 'Izlaz',
      ORDER : 'Narudžbina',
      NAME_ORDER : 'Ime narudžbine',
      IMAGE_SETTINGS : 'Podešavanje snimanja',
      NO_TERITORIES: 'Broj obeleženih teritorija:',
      SURFACE: 'Obeležena površina u ha:',
      IMAGE_TYPES: 'Tipovi snimanja:',
      IMAGE_START: 'Početak snimanja:',
      IMAGE_END: 'Kraj snimanja:',
      IMAGE_FREQ: 'Frekvencija snimanja:',
      SENSOR_SETTINGS: 'Podešavanja senzora',
      NO_SENSORS: 'Broj obeleženih senzora'

    });
    $translateProvider.preferredLanguage('rs');
});

userApp.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
    	console.log("filter called " + url);
        return $sce.trustAsResourceUrl(url);
    };
}]);

userApp.directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //call the function that was passed
                    console.log("imageonload called");
                    scope.$apply(attrs.imageonload);
                });
            }
        };
});

userApp.directive("mySrc", function() {
    return {
      link: function(scope, element, attrs) {
        var img, loadImage;
        img = null;

        loadImage = function() {

          element[0].src = "/img/spinner.gif";

          img = new Image();
          img.src = attrs.mySrc;

          img.onload = function() {
            element[0].src = attrs.mySrc;
          };
        };

        scope.$watch((function() {
          return attrs.mySrc;
        }), function(newVal, oldVal) {
          if (oldVal !== newVal) {
            loadImage();
          }
        });
      }
    };
  });