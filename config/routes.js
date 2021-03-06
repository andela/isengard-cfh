const async = require('async');

module.exports = function (app, passport, auth) {
    // User Routes
  const users = require('../app/controllers/users');
  const region = require('../app/controllers/region');
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

   // Setting up the users api
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);

  app.post('/api/auth/signup', users.create);
    // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

    // login endpoint
  app.post('/api/auth/signin', users.login);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

    // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Finish with setting up the userId param
  app.param('userId', users.user);

    // Answer Routes
  const answers = require('../app/controllers/answers');
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
    // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

    // Question Routes
  const questions = require('../app/controllers/questions');
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
    // Finish with setting up the questionId param
  app.param('questionId', questions.question);

    // Avatar Routes
  const avatars = require('../app/controllers/avatars');
  app.get('/avatars', avatars.allJSON);

    // Home route
  const index = require('../app/controllers/index');
  app.get('/play', index.play);
  app.get('/', index.render);
  app.get('/api/auth/play', index.play);
  // Route for region
  app.post('/api/region', region.setRegion);

  // Route for the leaderboard
  const board = require('../app/controllers/leaderBoard');
  app.get('/api/auth/leaderboard', board.leaderBoard);

  // Route for Game History
  var game = require('../app/controllers/gameHistory');
  app.get('/api/auth/history', game.gameHistory);

  // Route to get donations
  app.get('/api/auth/donations', users.getDonations);
  // Game routes
  var game = require('../app/controllers/game');
  app.post('/api/games/:id/start', game.startGame);
  app.post('/api/games/:id/end', game.endGame);
};
