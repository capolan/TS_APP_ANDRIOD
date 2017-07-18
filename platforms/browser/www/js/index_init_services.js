/*global data_support, intel */

/* --------------
 initialization
  the xdkFilter argument can be set to a function that
   receives the data of the service method and can return alternate data
   thus you can reformat dates or names, remove or add entries, etc.
   -------------- */

/*global angular*/
 angular.module('myApp',[]).config(['$controllerProvider', function($controllerProvider) {
	$controllerProvider.allowGlobals();
}]);


data_support.ready(intel.xdk.services.TS_ler_statusler_alertas.bind(null, {"xdkFilter":null}));
