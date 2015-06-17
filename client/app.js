'use strict';

var app = angular.module('searcheat', [
	'ngRoute',
	'controllers',
	'services'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/guidance.tpl.html'
		})
		.when('/city/:id/', {
			templateUrl: 'partials/city.tpl.html'
		});
}]);