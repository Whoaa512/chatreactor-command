var _ = require('lodash'),
    path = require('path'),
    cmd = require(path.join(__dirname, 'lib', 'command'));

var handler = function() {
  // TODO: Cleaner place to put this?
  Object.defineProperty(this, '_commands', { value: Object.create(null) });

  // TODO: Clean up vars dumped on bot object
  _.extend(this, {
    registerCommand: cmd.registerCommand,
    deregisterCommand: cmd.deregisterCommand,
    isCommand: cmd.isCommand,
    isValidOwner: cmd.isValidOwner
  });

  this.registerHook('message', function(nick, to, text, message) {
    var c;

    // TODO: Improve interface
    // TODO: Allow ignore owner here
    // TODO: PRIVMSG doesn't work here because the chatbot sends a message to itself -- to will be set to bot
    //       Just check to see if this.userName(?) === to and change target to nick
    if (this.isCommand(text)) {
      c = cmd.parseCommand(text);
      this.isValidOwner(nick).then(_.bind(function(is) {
        if (is && _.has(this._commands, c.command)) {
          this._commands[c.command].apply(this, [nick, to, text, c.args, message]);
        }
      }, this));
    }
  });
};

module.exports = handler;
