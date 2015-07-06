'use strict';

angular.module('controllers').controller('truck-form-controller', ['$scope', '$routeParams', 'db', function($scope, $routeParams, db) {
	$scope.truck = {};
	$scope.map =  {};

	$scope.city = {};
	$scope.city.id = $routeParams.id;

	$scope.db = new db('cities');
	$scope.foodtypes_db = new db('foodtypes');
	$scope.trucks_db = new db('trucks');

	$scope.foodtypes = {};

	//select de tipos de comida cadastrados

	$scope.init = function() {
		$scope.map.create();

		if($scope.city.id)
		{
			console.log($scope.city.id);
			$scope.db.read($scope.city.id)
			.success(function(data) {
				console.log(data);
				var pos = new google.maps.LatLng(data.geoposition.latitude, data.geoposition.longitude);
				$scope.map.control.setCenter(pos);
				$scope.map.control.setZoom(14);
				$scope.map.marker.setPosition($scope.map.control.getCenter());
			})
			.error(function(e) {
				console.log(e);
			});
		}

		$scope.foodtypes_db.list()
			.success(function(data) {
				$scope.foodtypes = data;
			})
			.error(function(e) {
				console.log(e);
			});

		//e se tiver gps ativado, ja move o center e zoom do mapa pra cidade do cara;
	};

	//so i'm following the map that leads to you
	$scope.map.create = function() {
		$scope.map.canvas = document.getElementById('truck-form-map');
		$scope.map.options = {
			center: new google.maps.LatLng(-15.126867635531303, -53.18050174999996),
			zoom: 3,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: false,
			mapTypeControl: false,
			zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL}
		};

		$scope.map.control = new google.maps.Map($scope.map.canvas, $scope.map.options);

		$scope.map.create_input();
		$scope.map.create_marker();
	};

	$scope.map.create_input = function() {
		var input = document.getElementById('pac-input');
		$scope.map.control.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

		var search_box = new google.maps.places.SearchBox(input);

		google.maps.event.addListener(search_box, 'places_changed', function() {
			var bounds = new google.maps.LatLngBounds();

			var places = search_box.getPlaces();
			for(var i = 0, place; place = places[i]; i++)
			{
				bounds.extend(place.geometry.location);
			}

			$scope.map.control.fitBounds(bounds);
			$scope.map.marker.setPosition($scope.map.control.getCenter());
		});
	};

	$scope.map.create_marker = function() {
		$scope.map.marker = new google.maps.Marker({
			title: $scope.truck.name,
			map: $scope.map.control,
			position: $scope.map.control.getCenter(),
			visible: true,
			draggable: true,

			icon: {
				url: '/img/markers/marker-unofficial.png',
				size: {width: 64, height: 64},
				scaledSize: {width: 64, height: 64}
			}
		});

		var center = $scope.map.control.getCenter();
		$scope.truck.geoposition = {
			latitude: center.lat(),
			longitude: center.lng(),
			accuracy: 8
		};

		console.log($scope.map.control.getCenter());
		console.log($scope.map.marker.getPosition());

		google.maps.event.addListener($scope.map.marker, 'dragend', function() {
			var pos = $scope.map.marker.getPosition();
			$scope.truck.geoposition.latitude = pos.lat();
			$scope.truck.geoposition.longitude = pos.lng();

			console.log($scope.truck.geoposition);
		});
	}

	$scope.submit = function() {
		$scope.truck.foodtypes = [1, 2];
		$scope.trucks_db.create($scope.truck)
		.success(function(data) {
			console.log(data);
		})
		.error(function(e) {
			console.log(e);
		});
	}

	$scope.init();
}]);
