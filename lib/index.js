'use strict';

const http = require('http');

const config = require('../conf');
const util = require('./utils');

class RPCClient {
    constructor(config, key) {
        this.apiURL = config.apiURL;
        this.apiVersion = config.apiVersion;
        this.signatureMethod = config.signatureMethod;
        this.signatureVersion = config.signatureVersion;
        this.regionId = config.regionId;
        this.accessKeyId = key.accessKeyId;
        this.accessKeySecret = key.secretAccessKey;
    }

    request(action, params = {}, opts = {}) {
        action = util.firstLetterUpper(action);        

        if (opts.formatParams !== false) {
          params = util.formatParams(params);
        }

        var defaults = this._buildParams();

        params = Object.assign({
            Action: action
        }, defaults, params);


        var method = (opts.method || 'GET').toUpperCase();
        var normalized = util.normalize(params);
        var canonicalized = util.canonicalize(normalized);
        var stringToSign = `${method}&${util.encode('/')}&${util.encode(canonicalized)}`;

        const key = this.accessKeySecret + '&';

        var signature = util.sha1(stringToSign, key, 'base64');
        normalized.push(['Signature', util.encode(signature)]);

        const url = `${this.apiURL}/?${util.canonicalize(normalized)}`;
        var r = http.get(url).readAll().toString();

        return JSON.parse(r);
    }

    _buildParams() {
        return {
          Format: 'JSON',
          SignatureMethod: this.signatureMethod,
          SignatureNonce: util.makeNonce(),
          SignatureVersion: this.signatureVersion,
          Timestamp: util.timestamp(),
          AccessKeyId: this.accessKeyId,
          Version: this.apiVersion,
          RegionId: this.regionId,
        };
      }
}

class SMSClient extends RPCClient{
    constructor(key) {

        if (!key.accessKeyId) {
            throw new TypeError('parameter "accessKeyId" is required');
        }
        if (!key.secretAccessKey) {
            throw new TypeError('parameter "secretAccessKey" is required');
        }
        super(config, key);
    }

    sendSMS(params = {}, options) {
        return this.request('SendSms', params, options);
    }
}

module.exports = SMSClient