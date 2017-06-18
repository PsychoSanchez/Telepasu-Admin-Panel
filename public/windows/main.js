// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const req = require('electron-require');
const {ipcRenderer} = require('electron');
const requireText = require('require-text');
const {messages, commands, adminCommands} = req('../api/messages.js');
const AuthorizationWindow = require('./main/authorizationPage.js');
const dashboard = requireText('./dashboard/dashboard.html', require);
const d3 = req("./shared/d3.js");
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
        Date: "2017-06-14 20:11:56,2017-06-14 20:55:59",
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

        ipcRenderer.send('write', JSON.stringify({
          Action: 'Get Users Count'
        }));
        break;
      case 'Ping':
        setTimeout(function () {
          ipcRenderer.send('write', messages.ping());
        }, 4000);
        break;
      case 'Get Users Count':
        $('.users-count').html(data.Count);
        break;
      case "DBGetStatisticsResponse":
        svgPie.initPie(graphic[0], data.UserNumber, data.CallsCount);
        let fillData = [];
        data.statistics.forEach(function (item) {
          fillData.push({
            name: item.number,
            percent: +item.percentage
          })
        });
        svgPie.fillData(fillData);
        break;
      case "Get Modules List":
        let list = JSON.parse(msg.Modules);
        list.Modules = JSON.parse(list.Modules);
        list.NativeModules = JSON.parse(list.NativeModules);
        if (!list.Modules.length) {
          atsNotConnected.show();
        } else {
          atsNotConnected.hide();
        }
        if (!list.NativeModules.length) {
          moduleNotConnected.show();
        } else {
          moduleNotConnected.hide();
        }
        console.log('Connected modules', list);
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

const atsNotConnected = $('.ats-not-connected');
const moduleNotConnected = $('.module-not-connected');
const graphic = $('.graphic-cool');
const telepasu = new TelepasuMainWindow();
// console.log(login('oleg', 1488, 'Admin'));

var svgPie = {
  initPie: function (parent, number, count) {
    parent.innerHTML =
      `<div class="widget">
      <div class="flow-text center">Статистика для номера ` + number + `</div>
      <div class="flow-text center">Количество звонков за прошлые сутки: ` + count + `</div>
      <div id="chart" class="chart-container center"></div>
      </div>`;
  },
  fillData: function (dataset) {
    var pie = d3.layout.pie()
      .value(function (d) {
        return d.percent
      })
      .sort(null)
      .padAngle(.03);

    var w = 300, h = 300;

    var outerRadius = w / 2;
    var innerRadius = 100;

    var color = d3.scale.category10();

    var arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    var svg = d3.select("#chart")
      .append("svg")
      .attr({
        width: w,
        height: h,
        class: 'shadow'
      }).append('g')
      .attr({
        transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
      });
    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr({
        d: arc,
        fill: function (d, i) {
          return color(d.data.name);
        }
      });

    path.transition()
      .duration(1000)
      .attrTween('d', function (d) {
        var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });


    var restOfTheData = function () {
      var text = svg.selectAll('text')
        .data(pie(dataset))
        .enter()
        .append("text")
        .transition()
        .duration(200)
        .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".4em")
        .attr("text-anchor", "middle")
        .text(function (d) {
          return d.data.percent + "%";
        })
        .style({
          fill: '#fff',
          'font-size': '10px'
        });

      var legendRectSize = 20;
      var legendSpacing = 7;
      var legendHeight = legendRectSize + legendSpacing;


      var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr({
          class: 'legend',
          transform: function (d, i) {
            //Just a calculation for x & y position
            return 'translate(-35,' + ((i * legendHeight) - 65) + ')';
          }
        });
      legend.append('rect')
        .attr({
          width: legendRectSize,
          height: legendRectSize,
          rx: 20,
          ry: 20
        })
        .style({
          fill: color,
          stroke: color
        });

      legend.append('text')
        .attr({
          x: 30,
          y: 15
        })
        .text(function (d) {
          return d;
        }).style({
        fill: '#929DAF',
        'font-size': '14px'
      });
    };

    setTimeout(restOfTheData, 1000);
  }
};