angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', '$window', function ($scope, Global, $location, socket, game, AvatarService, $http, $window) {
  $scope.global = Global;

  $(document).ready(function() {
<<<<<<< HEAD
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
=======
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
>>>>>>> fix styling issues
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
         $window.localStorage.setItem('token', data.token);
         $window.location.href = '/';
       }
     });
  };
  $scope.playGame = function () {
    const token = $window.localStorage.getItem('token');
    const config = { headers: {
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
  $scope.gameHistory = function () {
    const token = $window.localStorage.getItem('token');
    const config = { headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json;odata=verbose',
      'X-Testing': 'testing'
    }
    };
    $http.get('/api/auth/history', config).success(function (data) {
      const gameData = {}, games = []; let processed = 0, gamePlayers = '';
      data.gameRecords.forEach(function(game, index) {
        gameData.index = index + 1;
        game.users.forEach(function(user) {
          processed += 1;
          gamePlayers = `${user.name} ,${gamePlayers}`;
          if (game.creatorId === user._id) {
            gameData.gameCreator = user.name;
          }
          if (game.winnerId === user._id) {
            gameData.gameWinner = user.name;
          }
          if (processed === game.users.length) {
            gameData.players = gamePlayers;
          }
        });
        games.push(gameData);
      });
      $scope.games = games;
    });
  };

  $scope.leaderboard = function () {
    const token = $window.localStorage.getItem('token');
    const config = { headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json;odata=verbose',
      'X-Testing': 'testing'
    }
    };
    $http.get('/api/auth/leaderboard', config).success(function (data) {
      const gameWinners = [], gameData = {};
      if (data.status === 'success' && data.users.length > 0) {
        const copy = data.users.slice(0); let count = 0;
        for (let i = 0; i < data.users.length; i += 1) {
          for (let w = 0; w < copy.length; w += 1) {
            if (data.users[i] === copy[w]) {
              count += 1;
              delete copy[w];
            }
          }
          if (count > 0) {
            gameData.name = data.users[i].name;
            gameData.index = i + 1;
            gameData.wins = count;
          }
          gameWinners.push(gameData);
        }
        $scope.gameWinners = gameWinners;
      }
    });
  };

  $scope.donations = function () {
    const token = $window.localStorage.getItem('token');
    const config = { headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json;odata=verbose',
      'X-Testing': 'testing'
    }
    };
    $http.get('/api/auth/donations', config).success(function (data) {
      if (data.status === 'failed') {
        $scope.status = data.status;
        $scope.message = data.message;
      } else {
        $scope.status = data.status;
        $scope.count = data.count;
      }
    });
  };

  $scope.selectAvatar = function(event, avatarIndex) {
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
