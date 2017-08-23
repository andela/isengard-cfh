/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const Game = mongoose.model('Game');
const User = mongoose.model('User');

exports.gameHistory = function (req, res) {
  const headerBearer = req.headers.authorization || [];
  const token = headerBearer.split(' ')[1];
  if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.json({ status: false,
            message: 'Authentication failed' });
        }
        let gamesProcessed = 0;
        User.findOne({ email: decoded._doc.email }).exec((err, user) => {
          if (!(user.gamesPlayed.length > 0)) {
            res.json({ message: 'No game played yet' });
          } else {
            const games = user.gamesPlayed;
            const result = {}, gameRecords = [];
            games.forEach((gameId, index, gamesPlayed) => {
              Game.findOne({ id: gameId })
              .exec((error, game) => {
                if (error) throw error;
                if (!game) {
                  res.json({ message: 'Game does not exist' });
                }
                const creatorId = mongoose.Types.ObjectId(game.creatorId);
                const winnerId = mongoose.Types.ObjectId(game.winnerId);
                const playersIdsString = game.playersIds;
                const playersIds = playersIdsString.map(userId => mongoose.Types.ObjectId(userId));
                User.find({ _id: { $in: playersIds } })
                .select('_id name email')
                .exec((err, users) => {
                  if (err) throw err;
                  if (users) {
                    result.creatorId = creatorId;
                    result.winnerId = winnerId;
                    result.users = users;
                    gameRecords.push(result);
                    gamesProcessed += 1;
                    if (gamesProcessed === gamesPlayed.length) {
                      return res.json({ status: 'success',
                        gameRecords
                      });
                    }
                  }
                });
              });
            });
          }
        });
      });
  } else {
    res.json({ message: 'No token provided' });
  }
};
