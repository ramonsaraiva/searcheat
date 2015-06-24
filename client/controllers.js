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
	$scope.trucks_db = new db('trucks');
	$scope.city = {};

	$scope.map = null;
	$scope.map_canvas = document.getElementById('map-canvas');

	$scope.infowindow = new google.maps.InfoWindow({
		content: '<div style="color: black;"><p>MALDIÇAO</p></div>'
	});

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
		/*var style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];*/

		$scope.map_options = {
			center: new google.maps.LatLng($scope.city.geoposition.latitude, $scope.city.geoposition.longitude),
			zoom: 14
		};

		$scope.map = new google.maps.Map($scope.map_canvas, $scope.map_options);

		google.maps.event.addListenerOnce($scope.map, 'tilesloaded', function() {
			console.log('igualop');
		});

		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng($scope.city.geoposition.latitude, $scope.city.geoposition.longitude),
			visible: true,
			title: 'teste de title'
		});

		google.maps.event.addListener(marker, 'mouseover', function() {
			$scope.infowindow.open($scope.map, this);
			console.log('over');
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			$scope.infowindow.close();
			console.log('out');
		});
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
}]);
