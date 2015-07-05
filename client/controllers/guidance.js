'use strict'

angular.module('controllers').controller('guidance-controller', ['$scope', '$rootScope', '$http', '$location', '$geolocation', 'db', function($scope, $rootScope, $http, $location, $geolocation, db) {
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
