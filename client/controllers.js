'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('guidance_controller', ['$scope', '$rootScope', '$http', '$location', '$geolocation', 'db', function($scope, $rootScope, $http, $location, $geolocation, db) {
	$scope.db = new db('cities');

	$scope.list = function() {
		$scope.db.list()
			.success(function(data) {
				$scope.data = data;
				$scope.get_current_position();
			});
	};

	$scope.get_current_position = function() {
		$geolocation.getCurrentPosition({
			timeout: 60000
		}).then(function(position) {
			var pos = position.coords;

			$http.post('/api/geocode/', {lat: pos.latitude, lng: pos.longitude})
				.success(function(data) {
					$rootScope.geoposition = position;
					$rootScope.geocity = data.city;

					for (var i in $scope.data)
					{
						if ($scope.data[i].name == data.city)
						{
							$scope.city = $scope.data[i].id;
						}
					}
				})
				.error(function(e) {
					console.log(e);
				});
		});
	};

	$scope.search = function() {
		$location.path('/cidade/' + $scope.city + '/');
	};

	$scope.list();
}]);

controllers.controller('city_controller', ['$scope', '$rootScope', '$routeParams', '$http', '$location', '$geolocation', 'db', function($scope, $rootScope, $routeParams, $http, $location, $geolocation, db) {
	$scope.db = new db('cities');
	$scope.trucks_db = new db('trucks');
	$scope.city = {};

	$scope.map = null;
	$scope.map_canvas = document.getElementById('map-canvas');
	$scope.map_markers = [];

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
		})
		.error(function(e) {
			$scope.city = null;
		});

	$scope.filter_markers_category = function()
	{
		//fazer um array de categories pra gerar o select (que provavelmente vem do server) e usar indices
		if($scope.category == '')
		{
			return;
		}

		console.log($scope.category);

		for(var i in $scope.city.trucks)
		{
			//conferir se a ordem ta igual, na real eh melhor adicionar category na marker e nao usar dois arrays
			if($scope.city.trucks[i].category == $scope.category)
				$scope.map_markers[i].setVisible(false);
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
			zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL }
		};

		$scope.map = new google.maps.Map($scope.map_canvas, $scope.map_options);

		google.maps.event.addListenerOnce($scope.map, 'tilesloaded', function() {
			//console.log('igualop');
		});

		for(var i in $scope.city.trucks)
		{
			var opts = jQuery.extend({}, $scope.city.trucks[i]);
			$scope.create_marker(opts);
		}

		$scope.create_legend();
		$scope.create_filters();
	};

	$scope.create_map_gui = function()
	{
		//create_legend + create_filters
	}

	$scope.create_filters = function()
	{
		var filter = document.createElement('div');
		filter.id = 'filter';
		var content = '<select style="color: black;" ng-model="category" ng-change="filter_markers_category()">'+
			'<option value=""></option>'+
			'<option value="hamburguer">Hamburguer</option>'+
			'<option value="ice_cream">Ice Cream</option>'+
			'<option value="BRAZIL">Brazil?</option>'+
		'</select>';

		filter.innerHTML = content;
		filter.index = 1;

		console.log(filter);

		//soh para testes, nao precisa ficar necessariamente dentro do mapa, ainda mais porque esse vai filtrar a lista tambem
		$scope.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(filter);
	}

	// essa funcao cria uma lenda
	$scope.create_legend = function()
	{
		var legend = document.createElement('div');
		legend.id = 'legend';
		var content = [];
		content.push('<h3>header</h3>');
		content.push('<p>Ativos</p>');
		content.push('<p>Inativos</p>');
		content.push('<p>Eventos</p>');
		legend.innerHTML = content.join('');
		legend.index = 1;
		console.log(legend.innerHTML);
		$scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
	}

	$scope.create_marker = function(opts)
	{
		var marker = new google.maps.Marker({
			title: opts.name,
			map: $scope.map,
			position: new google.maps.LatLng(opts.geoposition.latitude, opts.geoposition.longitude),
			visible: true,
			icon: {
				url: '/img/marker.png',
				size: {width: 64, height: 64},
				scaledSize: {width: 64, height: 64}
			}
		});

		//coisa mais ridicula e escrota da galaxia, puta merda
		// ramon: ehUAEHAUHEAUEHAUHEUAHEAUHEUAHeuAHEUAHEUHAE
		var content = '<div  class="marker-popup">'+
			'<div class="row vertical-align">'+
				'<div class="col-xs-4">'+
					'<img src="' + opts.icon_url + '" class="img-responsive img-circle" /></a>'+
				'</div>'+
				'<div class="col-xs-8">'+
					'<p>' + opts.name + '</p>'+
					'<p><small>Última alteração de posição: ' + opts.last_update + '</small></p>'+
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


controllers.controller('register_truck_controller',
['$scope', '$rootScope', '$routeParams', '$http', '$location', '$geolocation', 'db',
function($scope, $rootScope, $routeParams, $http, $location, $geolocation, db) {
	$scope.truck = {};
	$scope.map =  {};

	$scope.init = function() {
		$scope.map.create();
		//google.maps.event.addDomListener(window, 'load', $scope.map.create);
	};

	//so i'm following the map that leads to you
	$scope.map.create = function() {
		$scope.map.canvas = document.getElementById('register-map');
		$scope.map.options = {
			center: new google.maps.LatLng(-15.126867635531303, -53.18050174999996),
			zoom: 3,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: false,
			mapTypeControl: false,
			zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL}
		};

		$scope.map.control = new google.maps.Map($scope.map.canvas, $scope.map.options);

/*
		//a coisa ta feia
		google.maps.event.addListener($scope.map.control, 'idle', function() {
			console.log('idle');
			google.maps.event.trigger($scope.map.control, 'resize');
		});
		google.maps.event.addListenerOnce($scope.map.control, 'tilesloaded', function() {
			console.log('fhgsrhrhgwhzzzzzzzzzzzzzzzzzzzzzt');
			google.maps.event.addListenerOnce($scope.map.control, 'tilesloaded', function() {
				google.maps.event.trigger($scope.map.control, 'resize');
				console.log('fhgsrhrhgwht');
			});
		});

		$scope.map.current_center = null;
		google.maps.event.addListener($scope.map.control, 'resize', function() {
			$scope.map.current_center = $scope.map.control.getCenter();
		});

		google.maps.event.addListener($scope.map.control, 'bounds_changed', function() {
			if($scope.map.current_center) {
				$scope.map.control.setCenter($scope.map.current_center);
			}

			$scope.map.current_center = null;
		});
*/

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
				url: '/img/marker.png',
				size: {width: 64, height: 64},
				scaledSize: {width: 64, height: 64}
			}
		});

		console.log($scope.map.control.getCenter());

		google.maps.event.addListener($scope.map.marker, 'dragend', function() {
			console.log($scope.map.marker.getPosition());
		});
	}

	$scope.init();
}]);
