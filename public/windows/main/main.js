// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const req = require('electron-require');
const { ipcRenderer } = require('electron');
const { messages, commands, adminCommands } = req('../../api/messages.js');
const AuthorizationWindow = require('./authorizationPage.js');

const net = require('net');
const client = new net.Socket();
const auth = new AuthorizationWindow(client);

class TelepasuMainWindow {
  constructor() {
    this.initView();
    this.initEvents();
  }

  initView() {
    this.disconnectBtn = $('.disconnect-server').hide();
    this.afterAuth = $('.auth-true').hide();
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
        client.write(messages.login(auth.username.val(), auth.password.val(), 'Admin'));
      });
    });

    this.disconnectBtn.on('click', () => {
      client.write(commands.disconnect());
    });
    $('.connect-asterisk-btn').on('click', function (params) {
      client.write(adminCommands.connectAsterisk("mark", "hjok123", "192.168.1.39", 5038))
    });
  }

  initConnectionEvents() {
    client.on('data', (message) => {
      let data = message;
      try {
        data = JSON.parse(message);
      } catch (e) {
        console.log(message);
        return;
      }
      this.proceedAction(data);
    });

    client.on('error', (ex) => {
      this.handleSocketError(ex.message);
    });

    client.on('close', () => {
      console.log('Connection closed');
      client.destroy();
      this.setConnected(false);
    });
  }

  handleSocketError(error) {
    this.setConnected(false);
    let message;
    if (error.indexOf('ECONNREFUSED') !== -1) {
      message = 'Не удалось подключиться!';
    } else if (error.indexOf('ECONNREST') !== -1) {
      message = 'Удалённый хост разорвал подключение!';
    } else if (error.indexOf('ECONNRESET') !== -1) {
      message = 'Удалённый хост разорвал подключение!';
    } else {
      message = error;
      console.log(error);
    }
    Materialize.toast(message, 3000, 'rounded');
  }

  setConnected(value) {
    if (value) {
      this.afterAuth.fadeIn(1500);
      auth.setConnecting(false);
      auth.modal.fadeOut(1500);
      return;
    }
    this.afterAuth.fadeOut(1500);
    auth.setConnecting(false);
    auth.modal.fadeIn(1500);
  }

  proceedLogin(data) {
    if (data.Status === 200) {
      console.log(data.Message);
      Materialize.toast(data.Message, 3000, 'rounded');
      this.setConnected(true);
      client.write(messages.ping());
    } else {
      this.setConnected(false);
    }
  }

  proceedAction(data) {
    switch (data.Action) {
      case 'Login':
        this.proceedLogin(data);
        break;
      case 'Ping':
        setTimeout(function () {
          client.write(messages.ping());
        }, 4000);
        break;
      case "Disconnected":
        auth.setConnecting(false);
        auth.modal.fadeIn(1500);
        break;
      default:
        console.log('Received: ', data);
        break;
    }
  }
}

const telepasu = new TelepasuMainWindow();
// console.log(login('oleg', 1488, 'Admin'));

