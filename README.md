# fib-k8s-client

[![NPM version](https://img.shields.io/npm/v/fib-ali-sms?style=flat-square)](https://www.npmjs.com/package/fib-k8s-client)

fib-k8s-client is an Aliyun short message service client for FIBJS.


## Install

Via fibjs：

```
fibjs --install fib-ali-sms
```



Or, via npm:

```
npm install fib-ali-sms
```



## Usage

### config

```javascript
const conf = {
    "accessKeyId": "",      // accessKeyId applied from Aliyun
    "secretAccessKey": "",  // secretAccessKey applied from Aliyun
}
```


### Client Initialization

```javascript

const SMSClient = require("fib-ali-sms");
client = new SMSClient(conf);
```

 

### Basic Usage

**Send a short message:**

```javascript
const params = {
    PhoneNumbers: "",
    SignName: '',
    TemplateCode: 'SMS_*********',
    TemplateParam: '',
};

let r = client.sendSMS(params);
```

**Send batched short messages(TODO)**

**......**


You could find more detailed usage in test cases from [test](./test) directory.


# Testing

```shell
fibjs test
```



# License

[GPL - 3.0](./LICENSE)