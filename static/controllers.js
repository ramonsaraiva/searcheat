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

	$scope.list();
}]);
