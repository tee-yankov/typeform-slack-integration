import https = require('https');

interface TypeformConfigObject {
  uid: string;
  key: string;
}

interface SlackConfigObject {
  team: string;
  token: string;
  channels: string;
}

interface OptionsObject {
  hostname: string;
  path: string;
}

export function getTypeformData(config: TypeformConfigObject, cb: Function): void {
  var getEmails = function(): void {
    var options: OptionsObject = {
      hostname: 'https://api.typeform.com',
      path: '/v0/form/' + config.uid + '?key=' + config.key + '&completed=true'
    };
    var emails:Array<string> = [];
    var req = https.get(options.hostname + options.path, function (res) {
      var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
      res.setEncoding('utf8');
      res.on('data', function (d: string) {
        var email = d.match(emailRegex);
        if (email !== null) {
          email.map(function(key, index) {
            emails.push(key);
          });
        }
      });
    })
    req.on('error', function (e) {
      throw(e);
    });
    req.on('close', function() {
      cb({emails: emails});
    });
  }
  getEmails();
}

export function postSlackEmails(config: SlackConfigObject, emails: Array<string>, cb?: Function): void {
  cb = cb ? cb : function() {};
  emails.map(function(email: string, index: number) {
    var params:string = 'token=' + config.token +
    '&email=' + email +
    '&channels=C04GDEX56' +
    '&first_name=Test' +
    '&set_active=true' +
    '&_attempts=1';

    var options = {
      hostname: config.team + '.slack.com',
      path: '/api/users.admin.invite?t=' + (new Date).getTime(),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': params.length
      }
    };

    var req = https.request(options, function(res) {
      console.log(res.statusCode);
      res.setEncoding('utf8');
    });

    req.end(params);
  });
}
