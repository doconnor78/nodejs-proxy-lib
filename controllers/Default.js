'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.message = function message (req, res, next) {
  Default.message(req.swagger.params, res, next);
};
