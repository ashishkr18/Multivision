var mainApp = angular.module('app', ['ngResource', 'ngRoute']);
mainApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controller: 'mainCtrl'
        });
});

mainApp.service('httpService', function($http) {
    this.get = function(url) {
        return $http({
            method: 'GET'
                // data: data
        });
    };
});

mainApp.controller('mainCtrl', ['$scope', '$http', 'httpService', function($scope, $http, httpService) {
    $scope.myVar = "Hello Angular";
    $scope.mongoMessage = null;

    httpService.get('test').then(function(data) {
        if (data !== undefined && data !== null) {
            $scope.mongoMessage = data.data;
        }
    });
    // $scope.mongoMessage = httpService.get('test', function(data) {
    // });

    /*$http.get('test', function(data) {
        return data;
    }).then(function(data) {
        $scope.mongoMessage = data.data;
    });*/
}]);
