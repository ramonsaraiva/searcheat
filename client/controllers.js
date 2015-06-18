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
			latitude: 40.1451,
			longitude: -99.6680
		},
		zoom: 8
	};

	$scope.marker = {
		id: 0,
		coords: {
			latitude: 40.1451,
			longitude: -99.6680
		},
		options: {
			draggable: true
		},
		events: {
			dragend: function(marker, eventName, args) {
				var lat = marker.getPosition().lat();
				var lng = marker.getPosition().lng();
				console.log(lat);
				console.log(lng);
			}
		}
	};
}]);
