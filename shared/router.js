
Router.route('accountsResetPassword', {
  path: 'reset-password/:token',
  layoutTemplate: 'layout'
});

Router.route('accountsVerifyEmail', {
  path: 'verify-email/:token',
  layoutTemplate: 'layout',

  onBeforeAction: function() {
    Accounts.verifyEmail(this.params.token, function(error) {
      if (error) {
        Alerts.error(error.reason);
      } else {
        Accounts._enableAutoLogin();
      }
    });
    this.next();
  }
});


