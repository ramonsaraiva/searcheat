'use strict'

angular.module('controllers').controller('city-controller', ['$scope', '$rootScope', '$routeParams', '$http', '$location', '$geolocation', 'db', function($scope, $rootScope, $routeParams, $http, $location, $geolocation, db) {
	$scope.db = new db('cities');
	$scope.trucks_db = new db('trucks');
	$scope.foodtypes_db = new db('foodtypes');
	$scope.city = {};

	$scope.map = null;
	$scope.map_canvas = document.getElementById('map-canvas');
	$scope.map_markers = [];

	$scope.filter_modified = false;
	$scope.creating = false;

	/*pode dar uma merda do caralho
	google.maps.InfoWindow.prototype.isOpen = function() {
		console.log(infoWindow);
		var map = infoWindow.getMap();
		return (map !== null && typeof map !== 'undefined');
	}
	*/

	$geolocation.getCurrentPosition({
		timeout: 60000
	}).then(function(position) {
		var pos = position.coords;

		$http.post('/api/geocode/', {lat: pos.latitude, lng: pos.longitude})
			.success(function(data) {
				$rootScope.geoposition = position;
				$rootScope.geocity = data.city;

				if (data.city == $scope.city.name)
				{
					//$scope.map.setCenter({lat: $scope.geoposition.coords.latitude, lng: $scope.geoposition.coords.longitude});
					$scope.create_person_marker();
				}
			})
			.error(function(e) {
				console.log(e);
			});
	});

	$scope.infowindow = new google.maps.InfoWindow();
	$scope.open_marker = null;

	$scope.db.read($routeParams.id)
		.success(function(data) {
			$scope.city = data;
			$scope.create_map();
			console.log($scope.city);

			for (var i = 0, truck; truck = $scope.city.trucks[i]; i++)
			{
				truck.visible = true;
				var address_splitted = truck.address.split(',');
				truck.address = address_splitted[0] + address_splitted[1];
			}
		})
		.error(function(e) {
			$scope.city = null;
		});

	/* pega os foodtypes da cidade pra por no filter */
	$scope.foodtypes_db.read($routeParams.id)
		.success(function(data) {
			$scope.foodtypes = {};

			for (var i = 0, foodtype; foodtype = data[i]; i++)
			{
				$scope.foodtypes[foodtype.id] = { id: foodtype.id, name: foodtype.name, slug: foodtype.slug };
			}

			console.log($scope.foodtypes);
		})
		.error(function(e) {
			console.log(e);
		});

	$scope.foodtype_onclick = function(id)
	{
		if (!$scope.filter_modified)
		{
			$scope.filter_modified = true;
			$scope.foodtypes_selected = [];
		}

		var i = $scope.foodtypes_selected.indexOf(id);

		if (i >= 0)
		{
			$scope.foodtypes_selected.splice(i, 1);
		}
		else
		{
			$scope.foodtypes_selected.push(id);
		}

		if ($scope.foodtypes_selected.length == 0)
		{
			for (var i = 0, truck, marker; truck = $scope.city.trucks[i], marker = $scope.map_markers[i]; i++)
			{
				truck.visible = true;
				marker.setVisible(true);
			}

			return;
		}

		$scope.filter_by_foodtype();
	}

	$scope.filter_by_foodtype = function()
	{
		for (var i = 0, truck, marker; truck = $scope.city.trucks[i], marker = $scope.map_markers[i]; i++)
		{
			truck.visible = false;
			marker.setVisible(false);

			for (var j = 0, foodtype; foodtype = $scope.foodtypes_selected[j]; j++)
			{
				if (truck.foodtypes_ids.indexOf(foodtype) >= 0)
				{
					truck.visible = true;
					marker.setVisible(true);
					break;
				}
			}
		}
	}

	$scope.filter_markers_recent = function()
	{
		for(var i in $scope.city.trucks)
		{
			//if($scope.city.trucks[i].update bla bla bla)
		}
	}

	$scope.filter_markers_events = function()
	{
		for(var i in $scope.city.trucks)
		{
			//if($scope.city.trucks[i].inEvent bla bla bla)
		}
	}

	$scope.create_map = function()
	{
		$scope.map_options = {
			center: new google.maps.LatLng($scope.city.geoposition.latitude, $scope.city.geoposition.longitude),
			zoom: 14,
			panControl: false,
			mapTypeControl: false,
			zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL, position: google.maps.ControlPosition.RIGHT_TOP }
		};

		$scope.map = new google.maps.Map($scope.map_canvas, $scope.map_options);

		google.maps.event.addListenerOnce($scope.map, 'tilesloaded', function() {
			//console.log('igualop');
		});

		for(var i = 0, truck; truck = $scope.city.trucks[i]; i++)
		{
			var state = 'unofficial';

			if (truck.opened)
			{
				state = 'online';
			}
			else
			{
				state = 'offline';
			}

			$scope.create_marker(truck, state);
		}

		//var clusterer_options = { styles: [ width: 64, height: 64 ] };
		$scope.map_clusterer = new MarkerClusterer($scope.map, $scope.map_markers) //, clusterer_options);

		$scope.create_legend();
	};

	// essa funcao cria uma lenda
	$scope.create_legend = function()
	{
		var legend = document.getElementById('legend');
		legend.index = 1;
		$scope.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
	}

	$scope.create_marker = function(place, state)
	{
		var marker = new google.maps.Marker({
			title: place.name,
			map: $scope.map,
			position: new google.maps.LatLng(place.geoposition.latitude, place.geoposition.longitude),
			visible: true,
			icon: {
				url: '/img/markers/marker-' + state + '.png',
				size: {width: 64, height: 64},
				scaledSize: {width: 64, height: 64}
			}
		});

		//coisa mais ridicula e escrota da galaxia, puta merda
		// ramon: ehUAEHAUHEAUEHAUHEUAHEAUHEUAHeuAHEUAHEUHAE
		var foodtypes = '';


		var content = '<div  class="marker-popup">'+
			'<div class="row vertical-align">'+
				'<div class="col-xs-4">'+
					'<img src="' + place.icon_url + '" class="img-responsive img-circle" /></a>'+
				'</div>'+
				'<div class="col-xs-8">'+
					'<p>' + place.name + '</p>'+
					'<p><small>Última alteração de posição: ' + place.last_update + '</small></p>'+
				'</div>'+
			'</div>'+
		'</div>';

		var isOpen = function() {
			var map = $scope.infowindow.getMap();
			return (map !== null && typeof map !== 'undefined');
		};

		google.maps.event.addListener(marker, 'click', function() {
			if(marker === $scope.open_marker)
			{
				$scope.open_marker = null;
				$scope.infowindow.close();
				return;
			}

			$scope.open_marker = marker;
			$scope.infowindow.setContent(content);
			$scope.infowindow.open($scope.map, this);
		});

		/*
		google.maps.event.addListener(marker, 'mouseover', function() {
			$scope.infowindow.setContent(content);
			$scope.infowindow.open($scope.map, this);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			$scope.infowindow.close();
		});
		*/

		$scope.map_markers.push(marker);
	}

	$scope.create_person_marker = function()
	{
		console.log($scope.map.getCenter());
		var marker = new google.maps.Marker({
			title: 'Você',
			map: $scope.map,
			position: new google.maps.LatLng($scope.geoposition.coords.latitude, $scope.geoposition.coords.longitude),
			visible: true,
			icon: {
				url: '/img/person_marker.png',
				size: {width: 512, height: 512},
				scaledSize: {width: 64, height: 64}
			}
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
				$scope.creating = false;
			})
			.error(function(e) {
				console.log(e);
			});
	};

	$scope.create = function()
	{
		$scope.creating = true;
		jQuery('[data-target="#detailed-tab"]').click();
	}

	/*
	 * se o cara aperta na detailed tab sem selecionar nenhum truck..
	 * retorna pra tab da lista :)
	 */
	jQuery('[data-target="#detailed-tab"]').on('shown.bs.tab', function(e) {
		if (!$scope.truck && !$scope.creating)
		{
			jQuery('[data-target="#list-tab"]').click();
		}
	});

	jQuery('[data-target="#map-tab"]').on('shown.bs.tab', function(e) {
		google.maps.event.trigger($scope.map, 'resize');
	})
}]);
