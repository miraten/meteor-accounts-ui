
Template._forgotPasswordDialogContent.events({
  'click #signIn': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_signInDialogContent');
  },

  'submit #formForgotPassword': function(e) {
    e.preventDefault();

    var attributes = {
      email: $(e.target).find('[name=forgottenEmail]').val()
    };

    var validator = new Validator();
    if (! validator.api.isEmail(attributes.email))
      return Accounts.ui.Errors.set('error_invalid_email');

    // spin
    var spinner = new Spinner().spin();
    document.body.appendChild(spinner.el);

    Accounts.forgotPassword(attributes, function(error) {
      spinner.stop();

      if (error)
        return Accounts.ui.Errors.set(error.reason);

      var messageHTML = "<p>" + I18n.get('accounts.message.mailedResetPassword') + "</p>";
      Session.set('ACCOUNTS_RESULT_TITLE', I18n.get('accounts.title_reset_password'));
      Session.set('ACCOUNTS_RESULT_MESSAGE', messageHTML);
      return Accounts.ui.dialog('_accountsResultDialogContent');
    });
  }
});
