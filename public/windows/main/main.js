// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const req = require('electron-require');
const {ipcRenderer} = require('electron');
const {commands} = req('../../api/commands.js');
const {login} = req('../../api/messages.js');
const AuthorizationWindow = require('./authorizationPage.js');

const net = require('net');
const client = new net.Socket();
const auth = new AuthorizationWindow(client);
class TelepasuMainWindow {
  constructor() {
    this.initEvents();
  }

  initEvents() {
    this.initConnectionEvents();
    auth.submitBtn.on('click', function () {
      let IpPort = auth.ip.val().split(':');
      let port = IpPort[1];
      let ip = IpPort[0];

      if (!port) {
        port = 5000;
      }

      auth.setConnecting(true);
      client.connect(port, ip, () => {
        console.log('Connected');
        client.write(login(auth.username.val(), auth.password.val(), 'Admin'));
      });
    });
    // $('.connect-asterisk-btn').addEventListener('click', function (params) {
    //   client.write(commands.connectAsterisk("mark", "hjok123", "192.168.1.39", 5038))
    // });
  }

  initConnectionEvents() {
    client.on('data', function (data) {
      console.log('Received: ' + data);
      // client.destroy(); // kill client after server's response
    });

    client.on('error', (ex) => {
      TelepasuMainWindow.handleError(ex.message);
    });

    client.on('close', function () {
      console.log('Connection closed');
      client.destroy();
      auth.setConnecting(false);
    });
  }

  disconnected() {

  }

  static handleError(error) {
    if (error.indexOf('ECONNREFUSED') !== -1) {
      Materialize.toast('Connection refused!', 3000, 'rounded');
      auth.setConnecting(false);
    } else {
      Materialize.toast(error, 3000, 'rounded');
    }
  }
}

const telepasu = new TelepasuMainWindow();
// console.log(login('oleg', 1488, 'Admin'));

