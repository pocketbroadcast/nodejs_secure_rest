const https = require('https');
const fs = require('fs');

const badGuy = false; //true;

const options = {
  hostname: 'localhost',
  port: 9999,
  path: '/api/v1',
  method: 'GET',
  key: badGuy ? "" : fs.readFileSync('client/secret/client001_key.pem'),
  cert: fs.readFileSync('shared/certs/client001_cert.pem'),
  ca: [ fs.readFileSync('shared/certs/server_cert.pem') ] // needed to check servers self signed certificate
};

const req = https.request(options, function(res) {
    console.log(res.statusCode);
    res.on('data', function(d) {
        console.log(d.toString('binary'));
    });
});
req.on('error', (err) => {
    console.log(err);
})
req.end()