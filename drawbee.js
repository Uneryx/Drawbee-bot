var Discord = require('discord.io');
const client = new Discord.Client()
var CONFIG = require('./config.json');
var Character = CONFIG.Character;
var Wardrobe = CONFIG.Wardrobe;
var Action = CONFIG.Action;

var Infiniteloop = function() {
	ee.call(this);
	this.args = [];
};

Infiniteloop.prototype.add = function() {
	if ('function' === typeof arguments[0]) {
		this.handler = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		if (args.length > 0) {
			this.args = args;
		}
	} else {
		this.emit('error', new Error('when using add function, the first argument should be a function'));
		return 0;
	}
	return this;
};

Infiniteloop.prototype.run = function() {
	var handler = this.handler;
	var args = this.args;
	var that = this;

	function call() {
		that._immediateId = setImmediate(function() {
			if (typeof handler === 'function') {

				switch (args.length) {
					// fast cases
					case 0:
						handler.call(that);
						that.run();
						break;
					case 1:
						handler.call(that, args[0]);
						that.run();
						break;
					case 2:
						handler.call(that, args[0], args[1]);
						that.run();
						break;
						// slower
					default:
						handler.apply(that, args);
						that.run();
				}
			} else {
				//no function added
				that.emit('error', new Error('no function has been added to Infiniteloop'));
			}
		});
	}

	if (this.interval) {
		this._timeoutId = setTimeout(function() {
			call();
		}, that.interval);
	} else {
		call();
	}

	return this;

};

Infiniteloop.prototype.setInterval = function(interval) {
	if ('number' === typeof interval && interval > 0) {
		this.interval = interval;
	} else {
		this.emit('error', new Error('Interval should be a number, and must > 0 '));
	}

	return this;
};

Infiniteloop.prototype.removeInterval = function() {
	delete this.interval;
	return this;
};


Infiniteloop.prototype.onError = function(errHandler) {
	if ('function' === typeof errHandler) {
		this.on('error', errHandler);
	} else {
		this.emit('error', new Error('You should use a function to handle the error'));
	}
	return this;
};

Infiniteloop.prototype.stop = function() {
	console.log('timeout id', this._timeoutId);
	if (this._immediateId !== null && this._timeoutId === null) {
		clearImmediate(this._immediateId);
	} else if (this._timeoutId !== null) {
		clearTimeout(this._timeoutId);
	} else {
		this.emit('error', new Error('You cannot stop a loop before it has been started'));
	}
};
var il = new Infiniteloop;

function randomCharacter() {
	return Character[Math.floor(Math.random() * Character.length)];
};
il.add(randomCharacter, []);
function randomWardrobe() {
	return Wardrobe[Math.floor(Math.random() * Wardrobe.length)];
};
il.add(randomWardrobe,[]);
function randomAction() {
	return Action[Math.floor(Math.random() * Action.length)];
};
il.add(randomAction,[]);

il.run();

console.log(randomCharacter());
console.log(randomWardrobe());
console.log(randomAction());

client.on('ready', () => {
    console.log("Connected as " + client.user.tag),
    client.user.setActivity(":bee: lets draw! %help")
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(2) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "prompt") {
        var first = character[Math.floor(Math.random() * character.length)]
		var second = wardrobe[Math.floor(Math.random() * wardrobe.length)]
		var third = action[Math.floor(Math.random() * action.length)]
		receivedMessage.channel.send(":bee: Buzz! Your prompt is" + first + second + third + "! :bee:")
    } else if (primaryCommand == "character") {
        receivedMessage.channel.send(":bee: Buzz! Your character prompt is" + randomCharacter() + ":bee:")
    } else if (primaryCommand == "wardrobe") {
        receivedMessage.channel.send(":bee: Buzz! Your wardrobe prompt is" + randomWardrobe() + ":bee:")
    } else if (primaryCommand == "action") {
        receivedMessage.channel.send(":bee: Buzz! Your action prompt is" + randomAction() + ":bee:")
    } else if (primaryCommand == "help") {
        receivedMessage.channel.send(":bee: Buzz! You can get a full drawing suggestion with '%prompt'. I can also give you a 'character' 'wardrobe' or 'action', just put the % in front :bee:")
    } else {
        receivedMessage.channel.send(":bee: Buzzbuzz? I don't know what that is, can you try asking %help instead? :bee:")
    }
}



// function randomQuote() {
	quotes[Math.floor(Math.random() * quotes.length)]; //

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"


client.login(process.env.CLIENT_TOKEN)
