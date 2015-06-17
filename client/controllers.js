'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('guidance_controller', ['$scope', '$location', 'db', function($scope, $location, db) {
	$scope.db = new db('cities');
	$scope.city = 1;

	$scope.list = function() {
		$scope.db.list()
			.success(function(data) {
				$scope.data = data;
			});
	};

	$scope.search = function() {
		$location.path('/city/' + $scope.city + '/');
	};

	$scope.list();
}]);

controllers.controller('city_controller', ['$scope', '$routeParams', '$location', 'db', function($scope, $routeParams, $location, db) {
	$scope.db = new db('cities');
	$scope.id = $routeParams.id;
}]);

controllers.controller('map_controller', ['$scope', function($scope) {
	$scope.map = {
		center: {
			latitude: 45,
			longitude: -73
		},
		zoom: 8
	};
}]);