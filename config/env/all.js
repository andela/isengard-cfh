var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');
var keys = rootPath + '/keys.txt';

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: 'mongodb://isengard:isengard@ds047945.mlab.com:47945/isengard',
	secret: 'mySecrete'
};
