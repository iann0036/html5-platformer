<?php
	/* (c) iann0036 /*
	[Ping]
	1
	[Pos]
	2 username x y dir level
	[Talk]
	3 username message
	[Exit]
	4 username
	[NickChange]
	5 username newusername
	[PlayerList]
	6 csvlist
	[NewPlayer]
	7 username
	/**/
	
	set_time_limit(0);
	require 'class.PHPWebSocket.php';
	require 'class.Player.php';
	require 'class.Database.php';
	
	$guest_counter = 1;
	$players = array();

	function wsOnMessage($clientID, $message, $messageLength, $binary) {
		global $ws;
		
		$msgs = explode(' ',$message);
		
		if ($msgs[0] == 1) { // Ping
			$ws->wsSend($clientID,1);
		} else if ($msgs[0] == 3) { // Talk
			if (substr($message,2,1) == '/') {
				processCommand($clientID, substr($message,3)); // Server Command
			} else {
				broadcast("3 ".$players[$clientID]->getUsername()." ".substr($message,2),$clientID);
			}
		} else if ($msgs[0] == 2) { // Position
			broadcast("2 ".$players[$clientID]->getUsername()." $msgs[1] $msgs[2] $msgs[3] $msgs[4]",$clientID);
		}
	}

	function wsOnOpen($clientID) {
		global $ws;
		global $guest_counter;
		
		$player_list = array();
		
		$ip = long2ip($ws->wsClients[$clientID][6]);
		$ws->log("$ip ($clientID) has connected.");
		
		$players[$clientID] = new Player("Guest ".$guest_counter, $ip);
		$guest_counter++;
		
		broadcast("7 ".$players[$clientID]->getUsername(), $clientID); // tell others about new player
		
		if (count($players)>0) {
			foreach ($ws->wsClients as $id => $client) {
				if ($id != $clientID) {
					$player_list[] = $players[$id]->getUsername();
				}
			}
			
			$ws->wsSend($clientID, "6 ".implode(",",$player_list));
		}
	}

	function wsOnClose($clientID, $status) {
		global $ws;
		
		$ip = $players[$clientID]->getIP();
		$ws->log("$ip ($clientID) has disconnected.");

		broadcast("4 ".$players[$clientID]->getUsername());
		
		$players[$clientID] = null;
	}
	
	function processCommand($clientID, $command) {
		global $ws;
		
		$msgs = explode(' ',$command);
		$db = new Database();
		
		if ($msgs[0] == "register") {
			if ($db->register($msgs[1],$msgs[2])) {
				$ws->wsSend($clientID, "5 ".$players[$clientID]->getUsername()." ".$msgs[1]); // username change broadcast
				$players[$clientID]->setUsername($msgs[1]); // set username in class
				$ws->wsSend($clientID, "3 @ Registration success! Your new nickname is ".$players[$clientID]->getUsername()); // inform player
			} else {
				$ws->wsSend($clientID, "3 @ Username already taken");
			}
		} else if ($msgs[0] == "login") {
			if ($db->login($msgs[1],$msgs[2])) {
				$ws->wsSend($clientID, "5 ".$players[$clientID]->getUsername()." ".$msgs[1]); // username change broadcast
				$players[$clientID]->setUsername($msgs[1]); // set username in class
				$ws->wsSend($clientID, "3 @ You are now known as ".$players[$clientID]->getUsername()); // inform player
			} else {
				$ws->wsSend($clientID, "3 @ Login failed");
			}
		}
		
		$db = null;
	}
	
	function broadcast($message, $clientID = null)  {
		global $ws;
		
		foreach ($ws->wsClients as $id => $client) {
			if ($id != $clientID) { // ignore broadcasting player
				$ws->wsSend($id, $message);
			}
		}
	}

	// start the server
	$ws = new PHPWebSocket();
	$ws->bind('message', 'wsOnMessage');
	$ws->bind('open', 'wsOnOpen');
	$ws->bind('close', 'wsOnClose');
	$ws->wsStartServer('198.98.53.117', 443);

?>