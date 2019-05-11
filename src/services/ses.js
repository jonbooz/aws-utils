'use strict';

module.exports = {

    /**
     * 
     * @param {AwsUtils} aws 
     */
    _register: function(aws) {
        aws.ses = this;
        aws.ses.sendEmail = (subject, messageBody, source, recipients) => this._sendEmail(aws, subject, messageBody, source, recipients);
    },

    /**
     * 
     * @param {AwsUtils} aws 
     * @param {string} subject The subject line for the email
     * @param {string} messageBody The body of the email
     * @param {string} source The email address this sent email should come from.
     * @param {[string]} recipients A list of email address who should receive the email.
     */
    _sendEmail: function(aws, subject, messageBody, source, recipients) {
        var params = {
            Destination: { 
                ToAddresses: recipients
            },
            Message: { 
                Body: { 
                    Html: {
                        Charset: "UTF-8",
                        Data: messageBody
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: source
        };   

        return new Promise((resolve, reject) => {
            aws.call('SES', 'sendEmail', params)
                .then(resolve)
                .catch(reject);
        })
    }
}