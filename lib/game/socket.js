var ws;

function sendMessage(text) {
    ws.send('message', text);
}

function addUser(username) {
	onp = ig.game.spawnEntity(EntityOnp, -128, -128);
	onp.uid = username;
	ig.game.sortEntitiesDeferred();
}

function processCall(msg) {
    var onp;
    var players;
    var msgs = msg.split(" ");
	
	//log("DEBUG: " + msg);

    if (msgs[0] == 7) {
        addUser(msgs[1]);
    } else if (msgs[0] == 4) {
        players = ig.game.getEntitiesByType("EntityOnp");
        for (var i = 0; i < players.length; i++) {
            if (players[i].uid == msgs[1])
                players[i].kill();
        }
    } else if (msgs[0] == 2) {
        players = ig.game.getEntitiesByType("EntityOnp");
        for (var i = 0; i < players.length; i++) {
            if (players[i].uid == msgs[1]) {
				var move = new Array();
                move.x = parseInt(msgs[2]);
                move.y = parseInt(msgs[3]);
                move.dir = parseInt(msgs[4]);
				move.level = parseInt(msgs[5]);
				players[i].moves.push(move);
            }
        }
    } else if (msgs[0] == 3) {
		var onpmsg = new Array();
		var timer = new ig.Timer();
		timer.set(20);
		onpmsg.ttl = timer;
		if (msgs[1]=="@") {
			onpmsg.text = "* " + msgs.slice(2).join(" ");
		} else {
			onpmsg.text = msgs[1] + ": " + msgs.slice(2).join(" ");
		}
        ig.game.talk_history[ig.game.talk_history.length] = onpmsg;
    } else if (msgs[0] == 5) {
		players = ig.game.getEntitiesByType("EntityOnp");
		for (var i = 0; i < players.length; i++) {
            if (players[i].uid == msgs[1])
                players[i].uid = msgs[2];
			// insert notification of change here
        }
	} else if (msgs[0] == 6) {
		var newplayers = msgs[1].split(",");
		for (var i = 0; i < newplayers.length; i++) {
			addUser(newplayers[i]);
		}
	} else if (msgs[0] == 8) {
		ig.game.uid = msgs[1];
	} else
        log("Unknown Server Command: " + msgs);
}

function log(msg) {
	console.log(msg);
}

function startWebSocket() {
	ws = new FancyWebSocket('ws://198.98.53.117:443');

	ws.bind('open', function () {
		log("Connected.");
	});

	ws.bind('close', function (data) {
		log("Disconnected.");
	});

	ws.bind('message', function (payload) {
		processCall(payload);
	});

	ws.connect();
}