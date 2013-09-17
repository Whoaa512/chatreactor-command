/*
*  Utility code 
*/
var _ = require('lodash'),
    Q = require('q');

var isCommand = function(command) {
  return _.first(command) === this.commandPrefix;
};
exports.isCommand = isCommand;

var isValidOwner = function(nick) {
  var deferred = Q.defer();

  this.whois(nick, _.bind(function(res) {
    deferred.resolve(res && res.account && _.contains(this.owners, nick));
  }, this));

  return deferred.promise;
};
exports.isValidOwner = isValidOwner;

var parseCommand = function(incoming) {
  var args = incoming.slice(1).match(/([^\s]+)/g);

  return {
    command: args[0].toLowerCase(),
    args: _.rest(args)
  };
};
exports.parseCommand = parseCommand;

var registerCommand = function(command, action) {
  if (!_.isString(command) || _.isNumber(command)) {
    throw new TypeError('Command must be a string or a number');
  }

  if (!_.isFunction(action)) {
    throw new TypeError('Action must be a function');
  }

  this._commands[command] = action;
  return true;
};
exports.registerCommand = registerCommand;

var deregisterCommand = function(command) {
  if (!_.isString(command) || _.isNumber(command)) {
    throw new TypeError('Command must be a string or a number');
  }

  if (!_.has(this._commands, command)) {
    return false;
  }

  delete this._commands[command];
  return true;
};
exports.deregisterCommand = deregisterCommand;
