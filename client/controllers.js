'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('guidance_controller', ['$scope', '$location', 'db', function($scope, $location, db) {
	$scope.db = new db('cities');
	$scope.city = 1;

	$scope.list = function() {
		$scope.db.list()
			.success(function(data) {
				$scope.data = data;
				console.log($scope.data);
			});
	};

	$scope.search = function() {
		$location.path('/cidade/' + $scope.city + '/');
	};

	$scope.list();
}]);

controllers.controller('city_controller', ['$scope', '$routeParams', '$location', 'db', function($scope, $routeParams, $location, db) {
	$scope.db = new db('cities');
	$scope.city = {}

	$scope.db.read($routeParams.id)
		.success(function(data) {
			$scope.city = data;
			$scope.map_init();
			console.log($scope.city);
		})
		.error(function(e) {
			$scope.city = null;
		});

	$scope.map_init = function()
	{
		$scope.map = {
			control: {},

			center: {
				latitude: $scope.city.geoposition.latitude,
				longitude: $scope.city.geoposition.longitude
			},
			zoom: 8
		};

		$scope.options = {
			scrollwheel: false
		};

		$scope.trucks = [
			{
				id: 0,
				latitude: 40.1451,
				longitude: -99.6680,
				title: 'igualop'
			}
		];
	};

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

	*/
}]);
