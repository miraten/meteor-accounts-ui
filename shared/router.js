
Router.route('accountsResetPassword', {
  path: 'reset-password/:token',
  layoutTemplate: 'layout',

  onBeforeAction: function() {
    Session.set('entryError', void 0);
    Session.set('resetToken', this.params.token);
    this.next();
  }
});

Router.route('accountsVerifyEmail', {
  path: 'verify-email/:token',
  layoutTemplate: 'layout',

  onBeforeAction: function() {
    Accounts.verifyEmail(this.params.token, function(error) {
      if (error) {
        Session.set('entryError', error.reason);
      } else {
        console.log('Email verified');
        Accounts._enableAutoLogin();
      }
    });
    this.next();
  }
});


