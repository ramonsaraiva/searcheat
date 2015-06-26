'use strict';

var app = angular.module('searcheat', [
	'ngRoute',
	'ngGeolocation',
	'controllers',
	'services'
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
