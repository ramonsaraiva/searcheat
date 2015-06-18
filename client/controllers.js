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
		$location.path('/cidade/' + $scope.city + '/');
	};

	$scope.list();
}]);

controllers.controller('city_controller', ['$scope', '$routeParams', '$location', 'db', function($scope, $routeParams, $location, db) {
	//$scope.db = new db('cities');
	$scope.city = {}

	$scope.map = {
		center: {
			latitude: 40.1451,
			longitude: -99.6680
		},
		zoom: 8,
		bounds: {}
	};

	$scope.options = {
		scrollwheel: false
	};

	var createRandomMarker = function(i, bounds, idKey) {
		var lat_min = bounds.southwest.latitude,
		lat_range = bounds.northeast.latitude - lat_min,
		lng_min = bounds.southwest.longitude,
			lng_range = bounds.northeast.longitude - lng_min;

		if (idKey == null) {
			idKey = "id";
		}

		var latitude = lat_min + (Math.random() * lat_range);
		var longitude = lng_min + (Math.random() * lng_range);
		var ret = {
			latitude: latitude,
			longitude: longitude,
			title: 'm' + i
		};
		ret[idKey] = i;
		return ret;
	};

	$scope.randomMarkers = [];
	$scope.$watch(function() {
		return $scope.map.bounds;
	}, function(nv, ov) {
		if (!ov.southwest && nv.southwest) {
			var markers = [];
			for (var i = 0; i < 50; i++) {
				markers.push(createRandomMarker(i, $scope.map.bounds))
			}
			$scope.randomMarkers = markers;
		}
	}, true);

	/*
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

	$scope.db.read($routeParams.id)
		.success(function(data) {
			$scope.city = data;
		})
		.error(function(e) {
			$scope.city = null;
		});
	*/
}]);
