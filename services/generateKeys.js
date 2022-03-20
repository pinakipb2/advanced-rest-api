import crypto from 'crypto';

// For Secret Keys
const key = crypto
  .randomBytes(40)
  .toString('hex')
  .split('')
  .map((ch) => (Math.round(Math.random()) ? ch.toUpperCase() : ch.toLowerCase()))
  .join('');

console.table({ key });
