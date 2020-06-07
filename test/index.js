const test = require("test");
const assert = require('assert');
test.setup();

const SMSClient = require("../lib");

describe("Send SMS", () => {
    const client = new SMSClient({
        "accessKeyId": "",
        "secretAccessKey": ""
    });

    it("Send successfully", () => {
        const params = {
            PhoneNumbers: "",
            SignName: '',
            TemplateCode: 'SMS_*********',
            TemplateParam: '',
        };

        let r = client.sendSMS(params);

        assert.equal(r.Code, "OK");
    });
});

test.run(console.DEBUG);





