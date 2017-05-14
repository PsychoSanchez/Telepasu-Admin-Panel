exports.commands = {
    connectAsterisk: function (username, pwd, ip, port) {
        return JSON.stringify({
            action: "Add Module",
            type: "Asterisk",
            username: username,
            pwd: pwd,
            ip: ip,
            port: port
        });
    }
};