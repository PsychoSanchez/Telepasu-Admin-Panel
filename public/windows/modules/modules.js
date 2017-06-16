/**
 * Created by Admin on 09.06.2017.
 */


$(".button-collapse").sideNav();
const modal = $('.modal').modal();
const ip = $('#ip-address');
const port = $('#port');
const description = $('#description');
const connectedModules = $('.connected-modules');
const connectedNativeModules = $('.connected-native-modules');
const nativeIp = $('#native-ip-address');
const nativePort = $('#native-port');
const nativeDescription = $('#native-description');
const nativeUsername = $('#native-username');
const nativePassword = $('#native-password');

const {ipcRenderer} = require('electron');
let moduleConnected = true;
ipcRenderer.on('data', function (event, msg) {
  msg = JSON.parse(msg);
  switch (msg.Action) {
    case 'Add Module':
      moduleConnected = true;
      if (msg.Connected === true) {
        Materialize.toast('Модуль успешно добавлен и подключен', 3000, 'rounded');
        let module = {
          ip: ip.val(),
          port: port.val(),
          description: description.val()
        };
        connectedModules.append($(`<tr>
            <td>` + module.ip + ':' + module.port + `</td>
            <td>` + module.description + `</td>
            <td>Подключен</td>
            <td>
            <a class="btn-flat btn-small dropdown-button" href="#!"
            data-activates="dropdown2"><i class="material-icons">edit</i></a>
            </td>
          </tr>`)
        );
        modal.modal('close');
      } else {
        Materialize.toast('Не удалось подключить модуль', 3000, 'rounded');
      }
      break;
    case 'Add Native Module':
      moduleConnected = true;
      if (msg.Connected === true) {
        connectedNativeModules.append($(`<tr>
            <td>` + msg.Ip + ':' + msg.Port + `</td>
            <td>` + msg.Type`</td>
            <td>Asterisk1</td>
            <td>Подключен</td>
            <td>
            <a class="btn-flat btn-small dropdown-button" href="#!"
            data-activates="dropdown2"><i class="material-icons">edit</i></a>
            </td>
          </tr>`)
        );
      } else {
        Materialize.toast('Не удалось подключить АТС', 3000, 'rounded');
      }
      break;
    case "Get Modules List":
      let list = JSON.parse(msg.Modules);
      list.Modules = JSON.parse(list.Modules);
      list.NativeModules = JSON.parse(list.NativeModules);
      console.log('Connected modules', list);
      list.Modules.forEach(function (module) {
        connectedModules.append($(`<tr>
            <td>` + module.Ip + ':' + module.Port + `</td>
            <td></td>
            <td>Подключен</td>
            <td>
            <a class="btn-flat btn-small dropdown-button" href="#!"
            data-activates="dropdown2"><i class="material-icons">edit</i></a>
            </td>
          </tr>`));
      });

      list.NativeModules.forEach(function (module) {
        connectedNativeModules.append($(`<tr>
            <td>` + module.Ip + ':' + module.Port + `</td>
            <td>` + module.Type`</td>
            <td>Asterisk1</td>
            <td>Подключен</td>
            <td>
            <a class="btn-flat btn-small dropdown-button" href="#!"
            data-activates="dropdown2"><i class="material-icons">edit</i></a>
            </td>
          </tr>`));
      });
      break;
    default:
      console.log(msg);
      break;
  }
});

ipcRenderer.on('close', function (event, msg) {

});

ipcRenderer.on('error', function (event, msg) {

});

ipcRenderer.send('update-reciever', '');

ipcRenderer.send('write', JSON.stringify({
  Action: "Get Modules List"
}));

$('.add-module').click(function () {
  // Materialize.toast('Модуль успешно добавлен и подключен', 3000, 'rounded');
});

$('.add-asterisk').click(function () {
  // Materialize.toast('АТС Asterisk успешно добавлен и подключен', 3000, 'rounded');
});


$('.connect-module').on('click', function () {
  let connectModule = {
    Action: 'Add Module',
    Type: 'Module',
    Ip: ip.val(),
    Port: port.val()
  };
  ipcRenderer.send('write', JSON.stringify(connectModule));

  setTimeout(function () {
    if (!moduleConnected) {
      Materialize.toast('Не удалось подключить модуль', 3000, 'rounded');
    }
    moduleConnected = false;
  }, 5000);
});

$('.connect-native-module').on('click', function () {
  let connectModule = {
    Action: 'Add Native Module',
    Type: 'Asterisk',
    Ip: nativeIp.val(),
    Port: nativePort.val(),
    Username: nativeUsername.val(),
    Password: nativePassword.val(),
    Description: nativeDescription.val()
  };
  ipcRenderer.send('write', JSON.stringify(connectModule));

  setTimeout(function () {
    if (!moduleConnected) {
      Materialize.toast('Не удалось подключить модуль', 3000, 'rounded');
    }
    moduleConnected = false;
  }, 5000);
});