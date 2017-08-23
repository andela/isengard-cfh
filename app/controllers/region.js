/**
 * Module dependencies.
 */
var localStorage = require('localStorage');

/**
 * Find user by id
 */
exports.setRegion = function (req, res) {
  localStorage.setItem('regionSelected', req.body.region);
};
