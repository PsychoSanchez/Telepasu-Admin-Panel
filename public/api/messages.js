exports.messages = {
  login: function (username, pwd, type) {
    return 'Action: Login\r\n' +
      'Username: ' + username + '\r\n' +
      'Secret: ' + pwd + '\r\n' +
      'Type: ' + type + '\r\n' +
      'Events: On\r\n\r\n';
  },
  ping: function () {
    return JSON.stringify({
      Action: "Ping"
    });
  }
};

exports.commands = {
  disconnect: function () {
    return JSON.stringify({
      Action: "Disconnect"
    });
  }
};
exports.adminCommands = {
  connectAsterisk: function (username, pwd, ip, port) {
    return JSON.stringify({
      Action: "Add Module",
      Type: "Asterisk",
      Username: username,
      Pwd: pwd,
      Ip: ip,
      Port: port
    });
  }
};