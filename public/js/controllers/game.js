angular.module('mean.system')
.controller('GameController', ['$scope', 'game', '$timeout', '$location', '$http', 'MakeAWishFactsService', '$dialog', '$window', function ($scope, game, $timeout, $location, $http, MakeAWishFactsService, $dialog, $window) {
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

    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.data = {
      region: null
    };
    $scope.pickCard = function(card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            //delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
    }
  };

  $scope.pointerCursorStyle = function() {
    if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
      return {'cursor': 'pointer'};
    } else {
      return {};
    }
  };

  $scope.sendPickedCards = function() {
    game.pickCards($scope.pickedCards);
    $scope.showTable = true;
  };

  $scope.cardIsFirstSelected = function(card) {
    if (game.curQuestion.numAnswers > 1) {
      return card === $scope.pickedCards[0];
    } else {
      return false;
    }
  };

  $scope.cardIsSecondSelected = function(card) {
    if (game.curQuestion.numAnswers > 1) {
      return card === $scope.pickedCards[1];
    } else {
      return false;
    }
  };

  $scope.firstAnswer = function($index){
    if($index % 2 === 0 && game.curQuestion.numAnswers > 1){
      return true;
    } else{
      return false;
    }
  };

  $scope.secondAnswer = function($index){
    if($index % 2 === 1 && game.curQuestion.numAnswers > 1){
      return true;
    } else{
      return false;
    }
  };

  $scope.showFirst = function(card) {
    return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
  };

  $scope.showSecond = function(card) {
    return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
  };

  $scope.isCzar = function() {
    return game.czar === game.playerIndex;
  };

  $scope.isPlayer = function($index) {
    return $index === game.playerIndex;
  };

  $scope.isCustomGame = function() {
    return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
  };

  $scope.isPremium = function($index) {
    return game.players[$index].premium;
  };

  $scope.currentCzar = function($index) {
    return $index === game.czar;
  };

  $scope.winningColor = function($index) {
    if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
      return $scope.colors[game.players[game.winningCardPlayer].color];
    } else {
      return '#f9f9f9';
    }
  };

  $scope.pickWinning = function(winningSet) {
    if ($scope.isCzar()) {
      game.pickWinning(winningSet.card[0]);
      $scope.winningCardPicked = true;
    }
  };

  $scope.winnerPicked = function() {
    return game.winningCard !== -1;
  };

  $scope.startGame = function() {
    game.startGame();
    var token = $window.localStorage.getItem('token');
    var config = { headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json;odata=verbose',
        'X-Testing': 'testing'
      }
    };
    const playersIds = game.players.map((player, index) => {
      return player.userID;
    });
    $http.post(`/api/games/${game.gameID}/start`, {
      playersIds
    }, config).then((res) => {
      console.log('Game saved');
    }, (err) => {
      console.log(err);
    });
  };

  $scope.abandonGame = function() {
    game.leaveGame();
    $location.path('/');
  };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
  $scope.$watch('game.round', function() {
    $scope.hasPickedCards = false;
    $scope.showTable = false;
    $scope.winningCardPicked = false;
    $scope.makeAWishFact = makeAWishFacts.pop();
    if (!makeAWishFacts.length) {
      makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    }
    $scope.pickedCards = [];
  });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function() {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });
    $scope.regionModal = function () {
      const guestModal = $('#region');
      guestModal.modal('open');
    };
    
    $scope.selectRegion = function () {
      if ($scope.data.region === null) {
        Materialize.toast('No Region Selected!!', 4000, 'red');
        return;
      }
      var region = { region: $scope.data.region };
      $http.post('/api/region', JSON.stringify(region));
      const guestModal = $('#region');
      guestModal.modal('close');
      $scope.startGame();
    };


  $scope.$watch('game.gameID', function() {
    if (game.gameID && game.state === 'awaiting players') {
      if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({game: game.gameID});
          if(!$scope.modalShown){
            setTimeout(function(){
              var link = document.URL;
              var txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({'text-align': 'center', 'font-size':'22px', 'background': 'white', 'color': 'black'}).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
    }
  });

  $scope.startNextRound = () => {
    if ($scope.isCzar()) {
      game.startNextRound();
      }
    });
    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame',$location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame',null,true);
    } else {
      game.joinGame();
    }
  };

    $scope.shuffleCards = () => {
    // const target = $('#czarModal');
    const card = $(`#${event.target.id}`);
    card.addClass('animated flipOutY');
    setTimeout(() => {
      $scope.startNextRound();
      card.removeClass('animated flipOutY');
      // target.addClass('none');
    }, 500);
  };

  $scope.flipCards = () => {
    const card = angular.element(document.getElementsByClassName('special-czar-card'));
    card.addClass('slide');
    $timeout(() => {
      $scope.startNextRound();
      card.addClass('none');
    }, 4000);
  };

  if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
    console.log('joining custom game');
    game.joinGame('joinGame',$location.search().game);
  } else if ($location.search().custom) {
    game.joinGame('joinGame',null,true);
  } else {
    game.joinGame();
  }

    $scope.$watch ('game.modal', function() {
      if (game.modal === 'Cannot join game, maximum number of players exceeded') {
        $scope.modalShown = !$scope.modalShown;
      }
    });
}]);
