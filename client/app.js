'use strict';

var app = angular.module('searcheat', [
	'ngRoute',
	'controllers',
	'services',
	'uiGmapgoogle-maps'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/guidance.tpl.html'
		})
		.when('/cidade/:id/', {
			templateUrl: 'partials/city.tpl.html'
		})
}]);
