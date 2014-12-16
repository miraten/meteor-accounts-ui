AccountsErrors = new Mongo.Collection(null);

Accounts.ui.Errors = {
  clear: function() {
    AccountsErrors.remove({});
  },

  set: function(error) {
    var message = I18n.get(error);
    AccountsErrors.insert({ message: ((message) ? message : error) });
  }
};

Template.accountsError.rendered = function() {
  var error = this.data;
  Meteor.setTimeout(function() {
    AccountsErrors.remove(error._id);
  }, 4000);
};

Template.accountsErrors.helpers({
  errors: function() {
    return AccountsErrors.find({});
  },

  errorsCount: function() {
    return AccountsErrors.find({}).count();
  }
});
