
Template._signInDialogContent.helpers({

});

Template._signInDialogContent.events({
  'click #signUp': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_signUpDialogContent');
  },

  'click #forgotPassword': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_forgotPasswordDialogContent');
  },

  'submit #formSignIn': function(e) {
    e.preventDefault();

    var email = $('input[name="email"]').val();
    email = email.toLowerCase();

    if (! email)
      return Accounts.ui.Errors.set("error_input_required");

    var password = $(e.target).find('[name=password]').val();

    // spin
    var spinner = new Spinner().spin();
    document.body.appendChild(spinner.el);

    return Meteor.loginWithPassword(email, password, function(error) {
      spinner.stop();

      if (error) {
        return Accounts.ui.Errors.set(error.reason);
      } else {
        $('#modalAccountsDialog').modal('hide');

        var user = Meteor.user();
        if (! user.emails[0].verified) {
          $.SmartMessageBox({
            title : I18n.get('title_login'),
            content : I18n.get('title_email_not_verified'),
            buttons : "[" + I18n.get('command_resend') + "][" + I18n.get('command_close') + "]"
          }, function(ButtonPress) {
            if (ButtonPress === I18n.get('command_resend')) {
              Router.go('profile');
            }
          });
        }
      }
    });
  }
});
