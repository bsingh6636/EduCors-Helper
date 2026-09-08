import validator from 'validator';

export function validateSignup(input = {}) {
  const { UserName, Name, Email, Password, Country } = input;
  if (
    ![UserName, Name, Email, Password].every(
      (value) => typeof value === 'string' && value.trim(),
    )
  ) {
    return 'Username, full name, email, and password are required.';
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(UserName.trim()))
    return 'Use 3–20 letters, numbers, or underscores for your username.';
  if (Name.trim().length < 2 || Name.trim().length > 80)
    return 'Your name must be between 2 and 80 characters.';
  if (!validator.isEmail(Email.trim()) || Email.length > 254)
    return 'Enter a valid email address.';
  if (Password.length < 8 || Buffer.byteLength(Password, 'utf8') > 72)
    return 'Use a password of at least 8 characters and no more than 72 bytes.';
  if (
    Country !== undefined &&
    (typeof Country !== 'string' || Country.length > 80)
  )
    return 'Enter a valid country.';
  return null;
}
