import { config } from 'dotenv';
config();

let SECRET = process.env.SECRET || '';
export { SECRET };
