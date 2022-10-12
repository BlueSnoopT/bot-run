const options = require('command-line-args')([{ name: "nullnexus-socket", type: String }, { name: "nullnexus-remote", type: String }]);

const express = require('express');
const app = express();
require('express-ws')(app);
const WS = require("ws");

var id = 0;
var clients = {};

var remote;

const npid = require('npid');
try {
    const pid = npid.create('/tmp/proxy.pid', true);
    pid.removeOnExit();
}
catch (error) {
    console.log(`Nullnexus proxy already running?`);
    process.exit(1);
}

function newRemote() {
    remote = new WS(options["nullnexus-remote"] || 'ws://network.lesshook.gq:3000/api/v1/proxy');
    remote.on("open", function () {
        console.log("Connected to remote")
    })
    remote.on("message", function (msg) {
        msg = JSON.parse(msg);
        clients[msg.id].send(msg.data);
    })
    remote.on("close", function () {
        console.log("Disconnected from remote");
        for (let [key, client] of Object.entries(clients)) {
            client.close();
        }
        clients = {};
        id = 0;
        setTimeout(newRemote, 10000);
    })
    remote.on("error", function (err) { })
}
newRemote();

app.ws('/api/v1/client', function (ws, req) {
    if (remote.readyState !== WS.OPEN)
        return ws.close();
    console.log("Client connected!");

    ws.id = ++id;
    clients[ws.id] = ws;
    remote.send(JSON.stringify({
        type: "connect",
        id: ws.id,
        data: {
            headers: req.headers
        },
    }));
    ws.on("message", function (msg) {
        remote.send(JSON.stringify({
            type: "message",
            id: ws.id,
            data: msg,
        }));
    });
    ws.on("close", function () {
        console.log("Client disconnected!");
        if (remote.readyState === WS.OPEN)
            remote.send(JSON.stringify({
                type: "disconnect",
                id: ws.id,
            }));
    })
})

if (require("fs").existsSync(options["nullnexus-socket"] || "/tmp/nullnexus.sock")) require("fs").unlinkSync(options["nullnexus-socket"] || "/tmp/nullnexus.sock");
app.listen(options["nullnexus-socket"] || "/tmp/nullnexus.sock", () => console.log("Nullnexus proxy listening!"));
