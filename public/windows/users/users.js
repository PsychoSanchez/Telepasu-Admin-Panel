/**
 * Created by Admin on 09.06.2017.
 */
$('.add-user').click(function () {
  Materialize.toast('Пользователь Mark успешно добавлен', 3000, 'rounded');
});
$('select').material_select();

const modal = $('.modal').modal();
const username = $('#username');
const pwd = $('#password');
const addUser = $('.add-user-btn');
const usersTable = $('.users-table');
const userRole = $('.user-role input');
const {ipcRenderer} = require('electron');


ipcRenderer.on('data', function (event, msg) {
  msg = JSON.parse(msg);
  switch (msg.Action) {
    case 'Get All Users':
      msg.Users.forEach(function (user) {
        usersTable.append(`
<tr>
       <td>` + user.Login + `</td>
        <td>` + user.Role.replace('admin', 'Администратор').replace('????????????????????????', 'Пользователь').replace('user', 'Пользователь').replace('manager', 'Руководитель') + `</td>
        <td><a class="btn-flat btn-small dropdown-button" href="#!"
               data-activates="dropdown2"><i class="material-icons">edit</i></a>
        </td></tr>
      `);
      });
      break;
    case 'Add User':
      break;
    default:
      usersTable.append(`
<tr>
       <td>` + msg.Username + `</td>
        <td>` + msg.Role.replace('admin', 'Администратор').replace('????????????????????????', 'Пользователь').replace('user', 'Пользователь').replace('manager', 'Руководитель') + `</td>
        <td><a class="btn-flat btn-small dropdown-button" href="#!"
               data-activates="dropdown2"><i class="material-icons">edit</i></a>
        </td></tr>
      `);
      modal.modal('close')
      console.log(msg);
      break;
  }
})
;

ipcRenderer.on('close', function (event, msg) {
});

ipcRenderer.on('error', function (event, msg) {
});

ipcRenderer.send('update-reciever', '');

ipcRenderer.send('write', JSON.stringify({
  Action: "Get All Users"
}));


addUser.click(function () {
  let role = (userRole.val() === 'По умолчанию') ? 'user' : userRole.val();
  ipcRenderer.send('write', JSON.stringify({
    Action: "Add User",
    Username: username.val(),
    Password: pwd.val(),
    Role: role.replace('Пользователь', 'user').replace('Администратор', 'admin').replace('Руководитель', 'manager')
  }));
});