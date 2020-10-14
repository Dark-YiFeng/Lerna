let rsa = require('./rsa_dependencies/rsa');
let base64 = require('./rsa_dependencies/base64');

let RSA_MODULUS =
  '8BFFF9B35D94FF455FC896601F9BD7E03F4001B054EC21DF72513D30DB211612D69F9C607885AFFEAD0C4AD8C29C7F1B6EB81B2ECE9173227DA1CA4883D72E4D4366A54133479CD60973FD58D98AE71E0FC66AF04C218C8ED8D3BF5C5244A391A3B7666B11B8D351748630094BC4183351BB6812E9848B044404D551346900D7';
let RSA_EXPONENT = '10001';

let RSAKey = rsa.RSAKey;

/* eslint-disable */
export function RSA(modulus, exponent) {
  modulus = modulus || RSA_MODULUS;
  exponent = exponent || RSA_EXPONENT;

  this._encryption = new RSAKey();
  this._encryption.setPublic(modulus, exponent);
}
RSA.prototype.encode = function (content) {
  return this._encryption.encrypt(content);
};
RSA.prototype.encrypt = function (plain, type) {
  let result = this._encryption.encrypt(plain);
  if (typeof type === 'undefined' || type === 'hex') {
    return rsa.linebrk(result);
  }
  if (type === 'base64') {
    return rsa.linebrk(base64.hex2b64(result));
    // return base64.hex2b64(rsa.linebrk())
  }
  throw new Error('unexpected type');
};
