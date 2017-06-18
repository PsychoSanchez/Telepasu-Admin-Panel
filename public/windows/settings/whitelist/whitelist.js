/**
 * Created by Admin on 09.06.2017.
 */
const whitelistTable = $('.ip-table');
const port = $('.allowed-port');
const ip = $('.ip-address');
const addButton = $('.add-ip-button');
const {ipcRenderer} = require('electron');

$(".button-collapse").sideNav();

addButton.click(function () {
  ipcRenderer.send('write', JSON.stringify({
    Action: 'Add White List',
    Address: ip.val()
  }));
});

ipcRenderer.on('data', function (event, msg) {
  msg = JSON.parse(msg);
  console.log(msg);
  switch (msg.Action) {
    case 'Add White List':
      whitelistTable.append(`
        <tr>
        <td>` + msg.Address + `</td>
        <td>any</td>
        <td><a class="btn-flat btn-small dropdown-button" href="#!"
               data-activates="dropdown2"><i
            class="material-icons">edit</i></a></td></tr>
        `);
      break;
    case 'Remove White List':
      break;
    case "Get White List":
      let list = JSON.parse(msg.Answer);
      list.forEach(function (item) {
        whitelistTable.append(`
<tr>
        <td>` + item.Address + `</td>
        <td>any</td>
        <td><a class="btn-flat btn-small dropdown-button" href="#!"
               data-activates="dropdown2"><i
            class="material-icons">edit</i></a></td></tr>
        `);
      });
      break;
    default:
      break;
  }
});

ipcRenderer.on('close', function (event, msg) {

});

ipcRenderer.on('error', function (event, msg) {

});

ipcRenderer.send('update-reciever', '');

ipcRenderer.send('write', JSON.stringify({
  Action: "Get White List"
}));