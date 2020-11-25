

// importing all the necessary libraries
const path = require ('path');
const nodemailer = require ('nodemailer');
const sendgridTransport = require ('nodemailer-sendgrid-transport')
const { config } = require  (path.resolve (__dirname, '..', 'appConfig', 'config'));

// main mailer function
const mailer = (from, to, subject, text, html) => {
    try {
        
        if (!from || !to || !subject || !text || !html) {
            throw new Error ('cannot send mail as full information is not given');
        }

        // making the mail transporter
        let mailTransporter = nodemailer.createTransport (sendgridTransport ({
            auth: {
                api_key: config.SENDGRID_API_KEY
            }
        }));

        // defining the mail details
        let mailDetails = {
            from,
            to,
            subject,
            text,
            html
        };

        // returning a promise to mailing function
        return new Promise ((resolve, reject) => {
            mailTransporter.sendMail (mailDetails, (error, data) => {
                if (error) {
                    reject (error);
                }
                else {
                    resolve (data);
                }
            })
        });

    }
    catch (error) {
        return res.status (401).send ({
            status: 'message',
            message: error.message
        })
    }
}

// exporting the mailer function
module.exports = {
    mailer
}