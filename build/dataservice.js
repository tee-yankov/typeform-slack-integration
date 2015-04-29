var https = require('https');
function getTypeformData(config, cb) {
    var getEmails = function () {
        var options = {
            hostname: 'https://api.typeform.com',
            path: '/v0/form/' + config.uid + '?key=' + config.key + '&completed=true'
        };
        var emails = [];
        var req = https.get(options.hostname + options.path, function (res) {
            var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
            res.setEncoding('utf8');
            res.on('data', function (d) {
                var email = d.match(emailRegex);
                if (email !== null) {
                    email.map(function (key, index) {
                        emails.push(key);
                    });
                }
            });
        });
        req.on('error', function (e) {
            throw (e);
        });
        req.on('close', function () {
            cb({ emails: emails });
        });
    };
    getEmails();
}
exports.getTypeformData = getTypeformData;
function postSlackEmails(config, emails, cb) {
    cb = cb ? cb : function () { };
    emails.map(function (email, index) {
        var params = 'token=' + config.token +
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
        var req = https.request(options, function (res) {
            console.log(res.statusCode);
            res.setEncoding('utf8');
        });
        req.end(params);
    });
}
exports.postSlackEmails = postSlackEmails;
