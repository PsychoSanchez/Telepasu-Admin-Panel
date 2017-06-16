// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const req = require('electron-require');
const {ipcRenderer} = require('electron');
const requireText = require('require-text');
const {messages, commands, adminCommands} = req('../api/messages.js');
const AuthorizationWindow = require('./main/authorizationPage.js');
const dashboard = requireText('./dashboard/dashboard.html', require);

const auth = new AuthorizationWindow();

class TelepasuMainWindow {
  constructor() {
    this.initView();
    this.initEvents();

    $(".button-collapse").sideNav();
    let connected = ipcRenderer.sendSync('isConnected');
    if (connected) {
      this.loginScreen.hide();
      this.dashboard.show();
      ipcRenderer.send('write', JSON.stringify({
        Tag: "DBTag",
        Action: "DBGetStatisticsAction",
        Guid: "123",
        Date: "2017-06-14 20:35:56,2017-06-14 20:35:59",
        UserNumber: "101",
        ServerUserLogin: "mark"
      }));

      ipcRenderer.send('write', JSON.stringify({
        Action: 'Get Users Count'
      }));

    } else {
      this.loginScreen.show();
      this.dashboard.hide();
    }
  }

  initView() {
    this.disconnectBtn = $('.disconnect-server');
    this.afterAuth = $('.auth-true').hide();
    this.loginScreen = $('.login');
    this.dashboard = $('.dashboard');
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
      ipcRenderer.send('connect-server', {
        ip: ip,
        port: port,
        username: auth.username.val(),
        password: auth.password.val()
      });
    });

    this.disconnectBtn.on('click', () => {
      ipcRenderer.send('write', commands.disconnect());
    });
    $('.connect-asterisk-btn').on('click', function (params) {
      ipcRenderer.send('write', adminCommands.connectAsterisk("mark", "hjok123", "192.168.1.39", 5038))
    });
  }

  initConnectionEvents() {
    ipcRenderer.on('data', (event, message) => {
      let data = message;
      try {
        data = JSON.parse(message);
        console.log(data);
      } catch (e) {
        console.log(message);
        return;
      }
      this.proceedAction(data);
    });
    ipcRenderer.on('error', (event, ex) => {
      this.handleSocketError(ex.code);
    });
    ipcRenderer.on('close', () => {
      console.log('Connection closed');
      this.setConnected(false);
    });
  }

  handleSocketError(error) {
    this.setConnected(false);
    let message;
    if (error === 'ECONNREFUSED') {
      message = 'Не удалось подключиться!';
    } else if (error === 'ECONNREST') {
      message = 'Удалённый хост разорвал подключение!';
    } else if (error === 'ECONNRESET') {
      message = 'Удалённый хост разорвал подключение!';
    } else {
      message = error;
      console.log(error);
    }
    Materialize.toast(message, 3000, 'rounded');
  }

  setConnected(value) {
    if (value) {
      this.loginScreen.fadeOut(1500);
      this.afterAuth.fadeIn(1500);
      this.dashboard.fadeIn(1500);
      auth.setConnecting(false);
      auth.modal.fadeOut(1500);
      return;
    }
    this.afterAuth.fadeOut(1500);
    this.dashboard.fadeOut(1500);
    auth.setConnecting(false);
    auth.modal.fadeIn(1500);
    this.loginScreen.fadeIn(1500);
  }

  proceedLogin(data) {
    if (data.Status === 200) {
      console.log(data.Message);
      Materialize.toast(data.Message, 3000, 'rounded');
      this.setConnected(true);
      ipcRenderer.send('write', messages.ping());
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
          ipcRenderer.send('write', messages.ping());
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

