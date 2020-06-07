'use strict'

const crypto = require('crypto');
const os = require('os');
const process = require('process');

function firstLetterUpper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function formatParams(params) {
    var keys = Object.keys(params);
    var newParams = {};

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      newParams[firstLetterUpper(key)] = params[key];
    }

    return newParams;
}

function makeNonce() {
    var counter = 0;
    var last;

    const machine = os.hostname();
    const pid = process.pid;
  
    var val = Math.floor(Math.random() * 1000000000000);

    if (val === last) {
        counter++;
    } else {
        counter = 0;
    }

    last = val;
    var uid = `${machine}${pid}${val}${counter}`;

    return md5(uid, 'hex');
};

function md5(data, encoding) {
    return makeHasher('md5', data, encoding);
}

function makeHasher(algorithm, data, encoding) {
    var shasum = crypto.createHash(algorithm);
    shasum.update(data);

    return shasum.digest(encoding);
};

function pad2(num) {
    if (num < 10) {
      return '0' + num;
    }

    return '' + num;
};

function timestamp() {
    var date = new Date();

    var YYYY = date.getUTCFullYear();
    var MM = pad2(date.getUTCMonth() + 1);
    var DD = pad2(date.getUTCDate());
    var HH = pad2(date.getUTCHours());
    var mm = pad2(date.getUTCMinutes());
    var ss = pad2(date.getUTCSeconds());

    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
}

function normalize(params) {
    var list = [];
    var keys = Object.keys(params).sort();

    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = params[key];

      if (Array.isArray(value)) {
        repeatList(list, key, value);
      } else {
        list.push([encode(key), encode(value)]);
      }
    }

    return list;
}

function canonicalize(normalized) {
    var fields = [];

    for (var i = 0; i < normalized.length; i++) {
      var [key, value] = normalized[i];
      fields.push(key + '=' + value);
    }

    return fields.join('&');
}

function encode(str) {
    var result = encodeURIComponent(str);

    return result.replace(/\!/g, '%21')
      .replace(/\'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
}

function sha1(data, key, encoding) {
    var hmac_sha1 = crypto.createHmac('sha1', key);
    hmac_sha1.update(data);

    return hmac_sha1.digest().toString(encoding);
};

module.exports = {
    firstLetterUpper: firstLetterUpper,
    formatParams: formatParams,
    makeNonce: makeNonce,
    timestamp: timestamp,
    normalize: normalize,
    canonicalize: canonicalize,
    encode: encode,
    sha1: sha1,
}