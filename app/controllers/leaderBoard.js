/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const Game = mongoose.model('Game');
const User = mongoose.model('User');


exports.leaderBoard = function (req, res) {
  const headerBearer = req.headers.authorization;
  const token = headerBearer.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.json({ status: false,
          message: 'Authentication failed' });
      } else {
        const gameWinners = [];
        Game.find({})
      .where('winnerId').ne(null)
      .sort({ creatorId: 1 })
      .select('winnerId -_id')
      .exec((err, winners) => {
        if (err) throw err;
        winners.forEach((winner) => {
          gameWinners.push(winner.winnerId);
        });
        User.find({ _id: { $in: gameWinners } })
        .select('name email _id')
        .exec((err, users) => {
          if (err) throw err;
          if (users) {
            res.json({ status: 'success', users });
          }
        });
      });
      }
    });
  }
};
