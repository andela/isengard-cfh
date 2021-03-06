/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  User = mongoose.model('User'),
  Game = mongoose.model('Game');
var avatars = require('./avatars').all();
var config = require('../../config/config');
var env = require('dotenv').config();

/**
 * Auth callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/chooseavatars');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    const token = jwt.sign(req.user, config.secret, {
      expiresIn: 60 * 60 * 24
    });
    res.json({
      success: true,
      token
    });
    // res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
  // res.redirect('/');
  res.json({ message: 'Logged out',
    status: true });
};

/**
 * Session
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/** 
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
    .exec(function (err, user) {
      if (user.avatar !== undefined) {
        res.redirect('/#!/');
      } else {
        res.redirect('/#!/choose-avatar');
      }
    });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/*
 * Create user
 */
exports.create = function (req, res, next) {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec(function (err, existingUser) {
      if (!existingUser) {
        var user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save(function (err) {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user: user
            });
          }
          req.logIn(user, function (err) {
            if (err) return next(err);
            // var userDetails = { email: user.email, password: user.password };
            var token = jwt.sign(user, config.secret, {
              expiresIn: 60 * 60 * 24  // token expires in 24 hours
            });
            res.json({
              status: true,
              token: token
            });
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};
exports.login = function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.json({
      success: false,
      message: 'You need to enter email or password'
    });
  }
  User.findOne({
    email: req.body.email
  }).exec(function (error, user) {
    console.log(user);
    if (error) throw error;
    if (!user) {
      return res.json({
        success: false,
        message: 'Unable to Login. Invalid Credentials'
      });
    }
    var isMatched = bcrypt.compareSync(req.body.password, user.hashed_password);
    if (isMatched) {
      req.logIn(user, function (err) {
        if (err) return next(err);
        var token = jwt.sign(user, config.secret, {
          expiresIn: 60 * 60 * 24 // in seconds
        });
        res.json({ success: true, token: token });
      });
    } else {
      return res.json({
        success: false,
        message: 'Invalid password'
      });
    }
  });
};

/**
 * @func
 */
exports.getDonation = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
    .exec(function (err, user) {
      if (user.avatar !== undefined) {
        res.redirect('/#!/');
      } else {
        res.redirect('/#!/choose-avatar');
      }
    });
  }
};

exports.getDonations = function (req, res) {
  const headerBearer = req.headers.authorization;
  const token = headerBearer.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        res.json({ status: false,
          message: 'Authentication failed' });
      }
      User.findOne({ email: decoded._doc.email })
      .exec(function(error, user) {
        if (error) throw error;
        if (!(user.donations.length > 0)) {
          res.json({ status: 'failed', message: 'You have made no donations yet. Plegde your support today and do some charity.' });
        } else {
          res.json({ status: 'success', count: user.donations.length });
        }
      });
    });
  }
};


/**
 * Assign avatar to user
 */
  exports.avatars = function (req, res) {
  // Update the current user's profile to include the avatar choice they've made
    if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
    .exec(function (err, user) {
      user.avatar = avatars[req.body.avatar];
      user.save();
    });
    }
    return res.redirect('/#!/app');
  };

  exports.addDonation = function (req, res) {
    if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
      if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
        User.findOne({
          _id: req.user._id
        })
      .exec(function (err, user) {
        // Confirm that this object hasn't already been entered
        var duplicate = false;
        for (var i = 0; i < user.donations.length; i++) {
          if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          console.log('Validated donation');
          user.donations.push(req.body);
          user.premium = 1;
          user.save();
        }
      });
      }
    }
    res.send();
  };
/**
 *  Show profile
 */
  exports.show = function (req, res) {
    var user = req.profile;

    res.render('users/show', {
      title: user.name,
       user: user
    });
  };

/**
 * Send User
 */
  exports.me = function (req, res) {
    res.jsonp(req.user || null);
  };
/**
 * Find user by id
 */
  exports.user = function (req, res, next, id) {
    User
    .findOne({
      _id: id
    })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
  };

