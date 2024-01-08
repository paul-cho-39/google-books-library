import { randomBytes, randomUUID } from 'crypto';

const generateSessionToken = () => {
   return randomUUID?.() ?? randomBytes(32).toString('hex');
};

const fromDate = (time: number, date = Date.now()) => {
   return new Date(date + time * 1000);
};

export { generateSessionToken, fromDate };
