
/*
    var messageWebSocket;
    var messageWriter;

    function startSend(message) {
        if (!messageWebSocket) {
            // Set up the socket data format and callbacks
            var webSocket = new Windows.Networking.Sockets.MessageWebSocket();
            // Both utf8 and binary message types are supported. If utf8 is specified then the developer
            // promises to only send utf8 encoded data.
            webSocket.control.messageType = Windows.Networking.Sockets.SocketMessageType.utf8;
            webSocket.onmessagereceived = onMessageReceived;
            webSocket.onclosed = onClosed;

            // By default 'serverAddress' is disabled and URI validation is not required. When enabling the
            // text box validating the URI is required since it was received from an untrusted source (user
            // input). The URI is validated by calling validateAndCreateUri() that will return 'null' for
            // strings that are not valid WebSocket URIs.
            // Note that when enabling the text box users may provide URIs to machines on the intrAnet
            // or intErnet. In these cases the app requires the "Home or Work Networking" or
            // "Internet (Client)" capability respectively.
            var uri = validateAndCreateUri("ws://216.245.218.68:9300/");
            if (!uri) {
                return;
            }

            WinJS.log && WinJS.log("Connecting to: " + uri.absoluteUri, "sample", "status");

            webSocket.connectAsync(uri).done(function () {

                WinJS.log && WinJS.log("Connected", "sample", "status");

                messageWebSocket = webSocket;
                // The default DataWriter encoding is utf8.
                messageWriter = new Windows.Storage.Streams.DataWriter(webSocket.outputStream);
                sendMessage(message);

            }, function (error) {
                var errorStatus = Windows.Networking.Sockets.WebSocketError.getStatus(error.number);
                if (errorStatus === Windows.Web.WebErrorStatus.cannotConnect ||
                    errorStatus === Windows.Web.WebErrorStatus.notFound ||
                    errorStatus === Windows.Web.WebErrorStatus.requestTimeout) {
                    WinJS.log && WinJS.log("Cannot connect to the server. Please make sure " +
                        "to run the server setup script before running the sample.", "sample", "error");
                }
                else {
                    WinJS.log && WinJS.log("Failed to connect: " + getError(error), "sample", "error");
                }
            });
        }
        else {
            WinJS.log && WinJS.log("Already Connected", "sample", "status");
            sendMessage(message);
        }
    }

    function onMessageReceived(args) {
        // The incoming message is already buffered.
        var dataReader = args.getDataReader();
        var msg = dataReader.readString(dataReader.unconsumedBufferLength);
        log(msg);
        processCall(msg);
    }

    function getMessageTypeName(messageType) {
        switch (messageType) {
            case Windows.Networking.Sockets.SocketMessageType.utf8:
                return "UTF-8";
            case Windows.Networking.Sockets.SocketMessageType.binary:
                return "Binary";
            default:
                return "Unknown";
        }
    }

    function sendMessage(message) {
        messageWriter.writeString(message);
        messageWriter.storeAsync().done("", sendError);
    }

    function sendError(error) {
        log("Send error: " + getError(error));
    }

    function onClosed(args) {
        log("Closed; Code: " + args.code + " Reason: " + args.reason);
        if (!messageWebSocket) {
            return;
        }

        closeSocketCore();
    }

    function closeSocket() {
        if (!messageWebSocket) {
            WinJS.log && WinJS.log("Not connected", "sample", "status");
            return;
        }

        WinJS.log && WinJS.log("Closing", "sample", "status");
        closeSocketCore(1000, "Closed due to user request.");
    }

    function closeSocketCore(closeCode, closeStatus) {
        if (closeCode && closeStatus) {
            messageWebSocket.close(closeCode, closeStatus);
        } else {
            messageWebSocket.close();
        }

        messageWebSocket = null;

        if (messageWriter) {
            messageWriter.close();
            messageWriter = null;
        }
    }

    function log(text) {
        console.log(text);
    }
*/