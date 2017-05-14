exports.login = function (username, pwd, type) {
  return 'Action: Login\r\n' +
    'Username: ' + username + '\r\n' +
    'Secret: ' + pwd + '\r\n' +
    'Type: ' + type + '\r\n' +
    'Events: On\r\n\r\n';
};
