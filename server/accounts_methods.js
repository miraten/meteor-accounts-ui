
Accounts.urls.resetPassword = function(token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.sendVerificationEmailExt = function (userId, address, lang) {
  // XXX Also generate a link using which someone can delete this
  // account if they own said address but weren't those who created
  // this account.

  // Make sure the user exists, and address is one of their addresses.
  var user = Meteor.users.findOne(userId);
  if (!user)
    throw new Error("Can't find user");
  // pick the first unverified address if we weren't passed an address.
  if (!address) {
    var email = _.find(user.emails || [],
      function (e) { return !e.verified; });
    address = (email || {}).address;
  }
  // make sure we have a valid address
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address))
    throw new Error("No such email address for user.");

  var tokenRecord = {
    token: Random.secret(),
    address: address,
    when: new Date()};
  Meteor.users.update(
    {_id: userId},
    {$push: {'services.email.verificationTokens': tokenRecord}});

  // before passing to template, update user object with new token
  Meteor._ensure(user, 'services', 'email');
  if (!user.services.email.verificationTokens) {
    user.services.email.verificationTokens = [];
  }
  user.services.email.verificationTokens.push(tokenRecord);

  var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);

  var options = {
    to: address,
    from: Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.verifyEmail.subject(user, lang),
    text: Accounts.emailTemplates.verifyEmail.text(user, verifyEmailUrl, lang)
  };

  if (typeof Accounts.emailTemplates.verifyEmail.html === 'function')
    options.html =
      Accounts.emailTemplates.verifyEmail.html(user, verifyEmailUrl, lang);

  Email.send(options);
};

Meteor.methods({
  createUserExt: function (options, lang) {
    // createUser() above does more checking.
    check(options, Object);
    if (Accounts._options.forbidClientAccountCreation)
      return {
        error: new Meteor.Error(403, "Signups forbidden")
      };

    try {
      var userId = Accounts.createUser(options);

      if (options.email && Accounts._options.sendVerificationEmail)
        Accounts.sendVerificationEmailExt(userId, options.email, lang);

      return { userId: userId };
    } catch (ex) {
      throw new Meteor.error(500, ex.message);
    }
  },

  sendVerificationEmail: function(lang) {
    check(lang, String);

    var user = Meteor.user();
    Accounts.sendVerificationEmailExt(user._id, user.emails[0].address, lang);

    return { userId: user._id };
  }
});

