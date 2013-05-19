<?php
	// (c) iann0036 //
	set_time_limit(0);
	require 'class.PHPWebSocket.php';
	require 'class.Player.php';
	$players = array();

	function wsOnMessage($clientID, $message, $messageLength, $binary) {
		global $Server;
		$ip = long2ip( $Server->wsClients[$clientID][6] );
		//$Server->log("$clientID says $message");
		if ($messageLength == 0) {
			//$Server->wsClose($clientID);
			$Server->log("Warning: Blank Message");
			return;
		} else if ($message == "HI") {
			//$Server->log("Server says HIPLAYER");
			$Server->wsSend($clientID,"HIPLAYER");
		} else if (substr($message,0,4) == "TALK") {
			foreach ( $Server->wsClients as $id => $client ) {
				if ( $id != $clientID )
					$Server->wsSend($id, "USERCHAT $clientID ".substr($message,5));
			}
		} else {
			foreach ( $Server->wsClients as $id => $client ) {
				if ( $id != $clientID )
					$Server->wsSend($id, "USERSTAT $clientID $message");
			}
		}
	}

	function wsOnOpen($clientID) {
		global $Server;
		$ip = long2ip( $Server->wsClients[$clientID][6] );

		$Server->log( "$ip ($clientID) has connected." );
		foreach ( $Server->wsClients as $id => $client ) {
			if ( $id != $clientID ) {
				$Server->wsSend($id, "USERJOIN $clientID"); // tell others about new addition
				$Server->wsSend($clientID, "USERJOIN $id"); // tell new addition about other players
			}
		}
		
		$players[$clientID] = new Player();
	}

	function wsOnClose($clientID, $status) {
		global $Server;
		$ip = long2ip( $Server->wsClients[$clientID][6] );

		$Server->log( "$ip ($clientID) has disconnected." );

		foreach ( $Server->wsClients as $id => $client )
			$Server->wsSend($id, "USEREXIT $clientID");
	}

	// start the server
	$Server = new PHPWebSocket();
	$Server->bind('message', 'wsOnMessage');
	$Server->bind('open', 'wsOnOpen');
	$Server->bind('close', 'wsOnClose');
	$Server->wsStartServer('CENCORED', 443);

?>