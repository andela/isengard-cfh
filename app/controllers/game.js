/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const Game = mongoose.model('Game');
const User = mongoose.model('User');
/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */
exports.play = function (req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    var headerBearer = req.headers.authorization;
    var token = headerBearer.split(' ')[1];
    if (token) {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          res.json({ status: false,
            message: 'Authentication failed' });
        }
        res.json({ status: true, user: decoded });
      });
    }
    // res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};
exports.startGame = function (req, res) {
  // const headerBearer = req.headers.authorization;
  // const token = headerBearer.split(' ')[1];
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          status: false,
          message: 'Token not valid'
        });
      }
      const gameId = req.params.id;
      const creatorId = decoded._doc._id;
      const winnerId = null;
      const playersIds = req.body.playersIds || [];
      playersIds.push(creatorId);
      const newGame = new Game({
        id: gameId,
        creatorId,
        winnerId,
        playersIds
      });
      newGame.save(function(err) {
        if (err) {
          return res.json({
            status: false,
            message: 'Could not save game'
          });
        }
        const filteredIds = playersIds.filter(function (userId) {
          // Verify that userId is valid mongo ID object
          if (/[a-f0-9]{24}/.test(userId)) {
            return true;
          }
          return false;
        });
        const userIds = filteredIds.map(function (userId) {
          return mongoose.Types.ObjectId(userId);
        });
        User.find({
          _id: {
            $in: userIds
          }
        }, function (err, users) {
          users.forEach(function(user) {
            User.update({ _id: user._id }, {
              $push: {
                gamesPlayed: gameId
              }
            }, function(err) {
              if (err) {
                return res.json({
                  status: false,
                  message: 'Could not add game to user model'
                });
              }
            });
          });
          return res.send({ err, users });
        });
      });
    });
  } else {
    res.json({
      status: false,
      message: 'No token provided'
    });
  }
};

exports.endGame = function(req, res) {
  // const headerBearer = req.headers.authorization;
  // const token = headerBearer.split(' ')[1];
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          status: false,
          message: 'Token not valid'
        });
      }
      const gameId = req.params.id;
      const userId = decoded._doc._id;
      const winnerId = req.body.winnerId;
      Game.find({
        id: gameId,
      }, function(err, game) {
        if (err || game.length === 0) {
          return res.json({
            status: false,
            message: 'Game not found'
          });
        }
        if (game[0].creatorId !== userId) {
          return res.json({
            status: false,
            message: 'Unauthorized. Only game creator can update game'
          });
        }
        Game.update({ id: gameId }, {
          $set: {
            winnerId
          }
        }, function(err) {
          if (err) {
            return res.json({
              status: false,
              message: 'Could not update game info',
              error: err
            });
          }
          return res.json({
            status: true,
            message: 'Game winner updated'
          });
        });
      });
    });
  } else {
    res.json({
      status: false,
      message: 'No token provided'
    });
  }
};
