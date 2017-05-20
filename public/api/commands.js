exports.commands = {
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