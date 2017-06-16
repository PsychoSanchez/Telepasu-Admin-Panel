const req = require('electron-require');

class AuthorizationWindow {
  constructor() {
    this.pending = false;
    this.modal = $('.authorization-form');
    this.submitBtn = this.modal.find('.connect-server');
    this.username = this.modal.find('#username');
    this.password = this.modal.find('#password');
    this.ip = this.modal.find('#ip-address');
    this.progressBar = this.modal.find('.progress-block');
    this.initEvents();
  }

  initEvents() {
    this.submitBtn.on('click', this.connect.bind(this));
  }

  connect() {

  }

  close() {

  }

  hide() {
    this.modal.addClass('scale-out');
  }

  show() {

  }

  setConnecting(value) {
    let remove = (value) ? 'pulse' : 'disabled';
    let add = (value) ? 'disabled' : 'pulse';
    let val = (value) ? 'Подключение' : 'Подключиться';

    this.submitBtn.removeClass(remove).addClass(add).text(val);
    if (value) {
      this.progressBar.css({display: 'inline-block'});
    } else {
      this.progressBar.hide();
    }
  }
}

module.exports = AuthorizationWindow;