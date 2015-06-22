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
	$scope.trucks_db = new db('trucks')
	$scope.city = {};

	$scope.db.read($routeParams.id)
		.success(function(data) {
			$scope.city = data;

			for(var i in $scope.city.trucks)
			{
				$scope.city.trucks[i].icon_obj = {
					url: $scope.city.trucks[i].icon_url,
					scaledSize: {height: 30, width: 30}
				};
			}
			$scope.map_init();
			console.log($scope.city);
		})
		.error(function(e) {
			$scope.city = null;
		});

	$scope.map_init = function()
	{
		var style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];

		$scope.map = {
			control: {},

			center: {
				latitude: $scope.city.geoposition.latitude,
				longitude: $scope.city.geoposition.longitude
			},
			zoom: 14,
			events: {
				tilesloaded: function(map) {
					$scope.$apply(function() {
						google.maps.event.trigger(map, 'resize');
					});
				},
				bounds_changed: function() {
					var gmap = $scope.map.control.getGMap();
					google.maps.event.trigger(gmap, 'resize');
				}
			},
		};

		$scope.options = {
			scrollwheel: false,
			draggable: true,
			styles: style
		};
	};

	$scope.map_resize = function()
	{
		var gmap = $scope.map.control.getGMap();
		google.maps.event.trigger(gmap, 'resize');
	}

	$scope.detailed = function(id)
	{
		$scope.trucks_db.read(id)
			.success(function(data) {
				$scope.truck = data;
				console.log(data);
				jQuery('[data-target="#detailed-tab"]').click();
			})
			.error(function(e) {
				console.log(e);
			});
	};

	/*
	 * se o cara aperta na detailed tab sem selecionar nenhum truck..
	 * retorna pra tab da lista :)
	 */
	jQuery('[data-target="#detailed-tab"]').on('shown.bs.tab', function(e) {
		if (!$scope.truck)
		{
			jQuery('[data-target="#list-tab"]').click();
		}
	});

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
