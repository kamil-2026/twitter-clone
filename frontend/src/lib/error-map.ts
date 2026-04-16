export const getErrorMessage = (error: any, defaultMessage: string = 'Something went wrong') => {
  const message = error.response?.data?.message || defaultMessage;
  const mapping: Record<string, string> = {
    'Email and username already exist': 'This email and username are already taken.',
    'Email already exists': 'This email is already registered.',
    'Username already exists': 'This username is already taken.',
    'Invalid credentials': 'The email or password you entered is incorrect.',
  };
  return mapping[message] || message;
};
