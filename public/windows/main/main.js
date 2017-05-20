// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const req = require('electron-require');
const { ipcRenderer } = require('electron');
const { messages, commands } = req('../../api/messages.js');
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
        client.write(messages.login(auth.username.val(), auth.password.val(), 'Admin'));
      });
    });
    // $('.connect-asterisk-btn').addEventListener('click', function (params) {
    //   client.write(commands.connectAsterisk("mark", "hjok123", "192.168.1.39", 5038))
    // });
  }
  porceedLogin(data) {
    if (data.Status === 200) {
      console.log(data.Message);
      Materialize.toast(data.Message, 3000, 'rounded');
      auth.setConnecting(false);
      auth.modal.fadeOut(1500);
      client.write(messages.ping());
    } else {
      auth.setConnecting(false);
      auth.modal.fadeIn(1500);
    }
  }
  proceedAction(data) {
     switch (data.Action) {
        case 'Login':
          this.porceedLogin(data);
          break;
        case 'Ping':
          setTimeout(function () {
            client.write(messages.ping());
          }, 4000);
          break;
        default:
          console.log('Received: ', data);
          break;
      }
  }

  initConnectionEvents() {
    client.on('data', (message) => {
      let data = message;
      try {
        data = JSON.parse(message);
      } catch (e) {
        console.log(data);
        return;
      }
      this.proceedAction(data);
    });

    client.on('error', (ex) => {
      TelepasuMainWindow.handleSocketError(ex.message);
    });

    client.on('close', function () {
      console.log('Connection closed');
      client.destroy();
      auth.modal.fadeIn(500);
      auth.setConnecting(false);
    });
  }

  disconnected() {

  }

  static handleSocketError(error) {
    auth.setConnecting(false);
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
}

const telepasu = new TelepasuMainWindow();
// console.log(login('oleg', 1488, 'Admin'));

