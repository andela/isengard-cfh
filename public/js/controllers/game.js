angular.module('mean.system')
.controller('GameController', ['$scope', 'game', '$timeout', function ($scope, game, $timeout) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.game = game;
    $scope.pickedCards = [];

    $scope.pickCard = function(card) {
      if ($scope.pickedCards.indexOf(card.id) < 0) {
        $scope.pickedCards.push(card.id);
        if (game.curQuestion.numAnswers === 1) {
          $scope.sendPickedCards();
        } else if (game.curQuestion.numAnswers === 2 &&
          $scope.pickedCards.length === 2) {
          //delay and send
          $scope.sendPickedCards();
          //setTimeout($scope.sendPickedCards, 1000);
        }
      } else {
        $scope.pickedCards.pop();
      }
    };

    $scope.sendPickedCards = function() {
      game.pickCards($scope.pickedCards);
      $scope.hasPickedCards = true;
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

    $scope.isCzar = function() {
      return game.czar === game.playerIndex;
    };

    $scope.currentCzar = function($index) {
      return $index === game.czar;
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
    };

    $scope.countdown = function(count,state){
      clearInterval(counter);
      var counter = $timeout(timer, 1000);
      function timer(){
        count -= 1;
        if(count <= 0 || game.state !== state){
          clearInterval(counter);
          return;
        }
        $scope.time = count;
        counter = $timeout(timer, 1000);
      }
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function() {
      $scope.hasPickedCards = false;
      $scope.winningCardPicked = false;
      $scope.pickedCards = [];
      $scope.countdown(game.timeLimits.stateChoosing/1000,game.state);
    });

    $scope.$watch('game.state', function() {
      if (game.state === 'waiting for czar to decide') {
        $scope.countdown(game.timeLimits.stateJudging/1000,game.state);
      } else if (game.state === 'winner has been chosen') {
        $scope.countdown(game.timeLimits.stateResults/1000,game.state);
      }
    });

    game.joinGame();
    // Use this in the HTML: <h2></h2>
    // <div ng-repeat="card in game.hand" ng-click="pickCard(card)">{{card.id}}</div>

}]);