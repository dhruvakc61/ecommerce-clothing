// Placeholder for validators.js
// Full implementation will be added later.
export const validateEmail = (email) => {
  if (!email) return false;
  // Light validation: must contain "@" and at least one dot after it.
  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < email.length - 1;
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== "" && value !== null && value !== undefined;
};
