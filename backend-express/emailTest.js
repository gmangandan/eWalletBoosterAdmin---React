const nodemailer = require('nodemailer');
const {nodeMailerPass, nodeMailerUser} = require('./config/config');
                   

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: nodeMailerUser,
        pass: nodeMailerPass
    }
})

const mailOptions = {
    from: 'sender@email.com', //sender address
    to: ['paulmckenna191986@hotmail.co.uk', 'mckennapaul27@gmail.com'], // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>'// plain text body
}

transporter.sendMail(mailOptions, function (err, info) {
    if(err) console.log(err);
    else console.log(info)
})