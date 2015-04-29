/// <reference path="./node"/>
var fsUtils = require('./fsUtils');
var config = require('./config');
var dataservice = require('./dataservice');
function main() {
    if (!config.typeform
        || !config.preferences
        || !config.slack) {
        throw 'Your config file is wrong!';
    }
    var emailsToSend = [];
    var emails = [];
    var log;
    var writeDataSuccess = function (data) {
        console.log(data);
        dataservice.postSlackEmails(config.slack, emailsToSend);
        console.log('Sending emails to ' + emailsToSend);
    };
    var writeData = function () {
        var jsonArr = [];
        var jsonString;
        if (!log) {
            var len = emails.length;
            emails.map(function (email, index) {
                emailsToSend.push(email);
                jsonArr.push(email);
            });
            jsonString = JSON.stringify(jsonArr);
            fsUtils.writeFile(config.preferences.logFile, jsonString, writeDataSuccess);
        }
        else {
            emails.map(function (email, index) {
                if (log.indexOf(email) === -1) {
                    emailsToSend.push(email);
                }
                jsonArr.push(email);
            });
            jsonString = JSON.stringify(jsonArr);
            fsUtils.writeFile(config.preferences.logFile, jsonString, writeDataSuccess);
        }
    };
    var receiveData = function (data) {
        if (data.log) {
            log = data.log;
        }
        if (data.emails) {
            emails = data.emails;
            writeData();
        }
    };
    fsUtils.readFile(config.preferences.logFile, receiveData);
    dataservice.getTypeformData(config.typeform, receiveData);
    return 0;
}
main();
