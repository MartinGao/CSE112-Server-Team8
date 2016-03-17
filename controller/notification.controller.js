import request from 'request';

const accountSid = 'AC75a8c29cd8fc85cd926afc9de2a7ac13';
const authToken = 'adeaa2b45ba12b8980a61872300e07b3';
const twilioClient = require('twilio')(accountSid, authToken);


export function sms(req, res) {
  twilioClient.sendMessage({
    to: req.body.to,
    from: '+17606218051',
    body: req.body.payload,
  }, (err, responseData) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(responseData);
    }
  });
}

export function email(req, res) {
  request({
    url: 'https://api:key-70e88d2cc33ae24b3ee564fb99d64276@api.mailgun.net/v3/sandboxc0f7e5f1d6d2484dae37436a331b3167.mailgun.org/messages',
    method: 'POST',
    form: {
      from: 'iReceptionist <postmaster@sandboxc0f7e5f1d6d2484dae37436a331b3167.mailgun.org>',
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.payload,
    },
  }, (err, body) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(body);
    }
  });
}
