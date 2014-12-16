var hashPassword = function (password) {
  return {
    digest: SHA256(password),
    algorithm: "sha-256"
  };
};

var createUser = function (options, callback) {
  options = _.clone(options); // we'll be modifying options

  if (typeof options.password !== 'string')
    throw new Error("Must set options.password");
  if (!options.password) {
    callback(new Meteor.Error(400, "Password may not be empty"));
    return;
  }

  // Replace password with the hashed password.
  options.password = hashPassword(options.password);

  Accounts.callLoginMethod({
    methodName: 'createUserExt',
    methodArguments: [options, I18n.getLanguage()],
    userCallback: callback
  });
};


Template._signUpDialogContent.helpers({
  termsOfUseLink: function() {
    return '<a href="#" data-toggle="modal" data-target="#modalTermsOfUse">' + I18n.get('accounts.label_terms_of_use') + '</a>'
  },
  privacyPolicyLink: function() {
    return '<a href="#" data-toggle="modal" data-target="#modalPrivacyPolicy">' + I18n.get('accounts.label_privacy_policy') + '</a>'
  }
});


Template._signUpDialogContent.events({
  'click #signIn': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_signInDialogContent');
  },

  'submit #formSignUp': function(e) {
    e.preventDefault();

    var agreements =  $(e.target).find('[name=agreements]:checked').val();
    if (! agreements)
      return Accounts.ui.Errors.set("accounts.error.agreements_required");

    var attributes = {
      username: $(e.target).find('[name=username]').val(),
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=password]').val()
    };

    // validation
    var response = Accounts.ui.CustomSettings.validators.signUp(attributes);
    if (response.errors().length > 0) {
      $('input').parent().removeClass('status-error');

      _.each(response.errors(), function(error) {
        var translated = "";
        _.each(error.messages, function(message) {
          translated += I18n.get(message);
        });
        var element = $(e.target).find('[name=' + error.attribute + ']').parent();
        element.addClass('state-error');
        element.next().html(translated);
      });

      return;
    }

    // spin
    var spinner = new Spinner().spin();
    document.body.appendChild(spinner.el);

    createUser(attributes, function(error) {
      spinner.stop();
      if (error)
        return Accounts.ui.Errors.set(error.reason);

      var messageHTML = "<h4>" + I18n.get('accounts.title_signup_done') + "</h4>";
      messageHTML += "<p>" + I18n.get('accounts.message.signUpInformVerifyEmailAddress') + "</p>";
      Session.set('ACCOUNTS_RESULT_TITLE', I18n.get('accounts.message.signup.welcome'));
      Session.set('ACCOUNTS_RESULT_MESSAGE', messageHTML);
      return Accounts.ui.dialog('_accountsResultDialogContent');
    });
  }
});
