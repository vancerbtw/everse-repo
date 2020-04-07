import crypto from "crypto";

export function encrypt(udid: string, model: string) {
  return new Promise<string>(
    (resolve, reject) => {
      crypto.pbkdf2(udid, model, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
   }
 );
};