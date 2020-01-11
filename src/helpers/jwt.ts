import { sign, verify } from 'jsonwebtoken';

import { SECRET } from '../constants';

let generateJWT = (id: string): string => sign(id, SECRET);
let decodeJWT = (token: string): string => {
  try {
    let result = verify(token, SECRET);
    if (typeof result === 'string') {
      return result;
    }
  } catch (e) {}
  return '';
};
export { generateJWT, decodeJWT };
