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
		content: '<div style="color: black;"><p>{{title}}</p></div>'
	});

	/*
		<div  class="marker-popup" ng-non-bindable>
			<div class="row vertical-align">
				<div class="col-xs-4">
					<img src="{{ icon_url }}" class="img-responsive img-circle" /></a>
				</div>
				<div class="col-xs-8">
					<p>{{name}}</p>
					<p><small>Última alteração de posição: {{ last_update }}</small></p>
				</div>
			</div>
		</div>
	*/

	$scope.db.read($routeParams.id)
		.success(function(data) {
			$scope.city = data;
			$scope.create_map();
			console.log($scope.city);
		})
		.error(function(e) {
			$scope.city = null;
		});

	$scope.create_map = function()
	{
		/*var style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];*/

		$scope.map_options = {
			center: new google.maps.LatLng($scope.city.geoposition.latitude, $scope.city.geoposition.longitude),
			zoom: 14
		};

		$scope.map = new google.maps.Map($scope.map_canvas, $scope.map_options);

		google.maps.event.addListenerOnce($scope.map, 'tilesloaded', function() {
			//console.log('igualop');
		});

		for(var i in $scope.city.trucks)
		{
			$scope.create_marker($scope.city.trucks[i]);
		}
	};

	$scope.create_marker = function(opts)
	{
		var marker = new google.maps.Marker({
			title: opts.name,
			map: $scope.map,
			position: new google.maps.LatLng(opts.geoposition.latitude, opts.geoposition.longitude),
			visible: true,
			icon: {
				url: opts.icon_url,
				scaledSize: {width: 30, height: 30}
			}
		});

		/*
		google.maps.event.addListener(marker, 'click', function() {
			$scope.infowindow.open($scope.map, this);
		});
		*/

		google.maps.event.addListener(marker, 'mouseover', function() {
			$scope.infowindow.setContent('<h1 style="color: black;">' + opts.name + '</h1>');
			$scope.infowindow.open($scope.map, this);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			$scope.infowindow.close();
		});
	}

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
