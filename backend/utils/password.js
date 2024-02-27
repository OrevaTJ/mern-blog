import { randomInt } from 'crypto';

export default function generatePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

