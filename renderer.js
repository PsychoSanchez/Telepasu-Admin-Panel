// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var loginMessage = 'Action: Login\r\n' +
    'Username: oleg\r\n' +
    'Secret: 1488\r\n' +
		'Type: Admin\r\n' +
    'Events: On\r\n\r\n';

var net = require('net');

var client = new net.Socket();
client.connect(5000, '127.0.0.1', function() {
    console.log('Connected');
		client.write(loginMessage);
    // client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    // client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});
