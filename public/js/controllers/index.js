angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', '$window', function ($scope, Global, $location, socket, game, AvatarService, $http, $window) {
    $scope.global = Global;

  $(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('nav').css('background-color', 'transparent');
    $('#nav-divider').css('background-color', 'rgba(255,187,10,1)');
    $('.button-collapse').sideNav({
      menuWidth: 315,
      edge: 'left',
      closeOnClick: true,
      draggable: true,
    });
  });

  $scope.playAsGuest = function () {
    game.joinGame();
    $location.path('/app');
  };
  $scope.showError = function () {
    if ($location.search().error) {
      return $location.search().error;
    }
    return false;
  };
  $scope.signin = function () {
    $http.post('/api/auth/signin', JSON.stringify($scope.formData))
        .success(function (data) {
          if (data.success === true) {
            $window.localStorage.setItem('token', data.token);
            $window.location.href = '/';
          } else {
            switch (data.message) {
              case 'Unable to Login. Invalid Credentials':
                $scope.errorMessage = 'Unable to Login. Invalid Credentials';
                break;
              case 'You need to enter email or password':
                $scope.errorMessage = 'You need to enter email or password';
                break;
              case 'Invalid password':
                $scope.errorMessage = 'Invalid password';
                break;
              default:
                $scope.errorMessage = false;
            }
          }
        })
        .error(function (error) {
        });
    };
    $scope.signup = function () {
      $http.post('/api/auth/signup', JSON.stringify($scope.formData))
        .success(function (data) {
          if (data.status === true) {
            $window.localStorage.setItem('token', JSON.stringify(data.token));
            $window.location.href = '/';
          }
        });
    };

    $scope.playGame = function () {
      var token = $window.localStorage.getItem('token');
      var config = {
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json;odata=verbose',
          'X-Testing': 'testing'
        }
      };
      $http.get('/api/auth/play?custom', config)
        .success(function (data) {
          if (data.status === true) {
            $window.location.href = '/#!/app?custom';
          }
        });
    };
    $scope.logout = function () {
      $window.localStorage.removeItem('token');
      $http.get('/signout').success(function (data) {
        if (data.status === true) {
          $window.location.href = '/';
        }
      }).error(function (error) {
      });
    };
    $scope.selectAvatar = function (event, avatarIndex) {
      const selectedAvatar = event.currentTarget;
      $('.avatars').removeClass('avatar-selected');
      $(selectedAvatar).addClass('avatar-selected');
      if ($scope.formData) {
        $scope.formData.avatar = avatarIndex;
      }
    };
    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });
  }]);
