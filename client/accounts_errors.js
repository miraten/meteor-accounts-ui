var accountsErrors = {
  "Incorrect password": "accounts.error_sign_in",
  "User not found": "accounts.error_sign_in",
  "Token expired": "accounts.error_reset_password_token_expired",
  "Username already exists.": "accounts.error_username_already_exist",
  "Email already exists.": "accounts.error_email_already_exist",
  "Email not found": "accounts.error_email_not_found"
};

getErrorMessage = function(message) {
  return (accountsErrors[message]) ? accountsErrors[message] : message;
};
