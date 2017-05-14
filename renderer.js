// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const req = require('electron-require');
const {ipcRenderer} = require('electron');
const {login} = req('./public/api/messages.js');
const {commands} = req('./public/api/commands.js');
const net = require('net');

var client = new net.Socket();
console.log(login('oleg', 1488, 'Admin'));
client.connect(5000, '127.0.0.1', function() {
  console.log('Connected');
  client.write(login('oleg', 1488, 'Admin'));
  // client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
  console.log('Received: ' + data);
  // client.destroy(); // kill client after server's response
});

client.on('close', function() {
  console.log('Connection closed');
});

document.querySelector('.connect-asterisk-btn').addEventListener('click', function (params) {
  client.write(commands.connectAsterisk("mark", "hjok123", "192.168.1.39", 5038))
});