angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', '$window', function ($scope, Global, $location, socket, game, AvatarService, $http, $window) {
    $scope.global = Global;

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.signup = function() {
      $http.post('/api/auth/signup', JSON.stringify($scope.formData))
      .success(function(data) {
        if (data.status === true) {
          $window.localStorage.setItem('token', JSON.stringify(data.token));
          $window.location.href = '/';
        }
      });
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });
}]);
