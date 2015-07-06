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
			templateUrl: 'partials/guidance-view.tpl.html'
		})
		.when('/cidade/:id/', {
			templateUrl: 'partials/city-view.tpl.html'
		})
		.when('/truck-form/:id/', {
			templateUrl: 'partials/truck-form.tpl.html'
		});
}]);
