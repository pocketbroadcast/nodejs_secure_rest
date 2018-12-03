const express = require('express')
const fs = require('fs')
const https = require('https')

const opts = { key: fs.readFileSync('server/secret/server_key.pem'),
               cert: fs.readFileSync('shared/certs/server_cert.pem'),
               requestCert: true,
               rejectUnauthorized: false,
               ca: [ fs.readFileSync('shared/certs/client001_cert.pem') ] // needed to check client's self signed certificates
                  //,fs.readFileSync('shared/certs/client002_cert.pem') ]
};

const app = express();

app.get('/api/v1', (req, res) => {
    const cert = req.connection.getPeerCertificate();
    
    if (req.client.authorized) {
        res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`);        
    } else if (cert.subject) {
		res.status(403)
           .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`);
    } else {
        res.status(401)
           .send(`Sorry, but you need to provide a valid client certificate to continue.`);
    }
});

const port = 9999;

https.createServer(opts, app).listen(port);

console.log("Server listening on port: " + port)