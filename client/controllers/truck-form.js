'use strict';

angular.module('controllers').controller('truck-form-controller', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.truck = {};
	$scope.map =  {};

	$scope.city = {};
	$scope.city.id = $routeParams.id;

	//select de tipos de comida cadastrados

	$scope.init = function() {
		$scope.map.create();

		if(!$scope.city.id)
		{
			console.log('sem id');
			//aqui agente pega o nome da cidade baseado no geopos atual do mapa;

			//e se tiver gps ativado, ja move o center e zoom do mapa pra cidade
			//do cara;
		}
		else
		{
			console.log('id: ', $scope.city.id);
		}

		//aqui assume que ja tem id, e ai qq faz?
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

		//console.log($scope.map.control.getCenter());

		google.maps.event.addListener($scope.map.marker, 'dragend', function() {
			var pos = $scope.map.marker.getPosition();
			$scope.truck.geoposition = {
				latitude: pos.lat(),
				longitude: pos.lng()
			};
		});
	}

	$scope.create = function() {
	}

	$scope.init();
}]);