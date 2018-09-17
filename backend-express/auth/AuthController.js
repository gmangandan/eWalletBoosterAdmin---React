// const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');

// router.use(bodyParser.urlencoded({extended: false}));
// router.use(bodyParser.json());

// const User = require('../models/User');
// const {secret} = require('../config/config');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// router.post('/register', function (req, res) {
//     // Hash the password
//     const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
//     // Create the new user in database
//     User.create({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: hashedPassword
//     }, 
//     function (err, user) {
//         if(err) return res.status(500).send('There was a problem registering the user.');
//         console.log(err)
//         // Creat a token
//         const token = jwt.sign({ id: user._id}, secret, {
//             expiresIn: 86400 // expires in 24 hours
//         });

//         res.status(200).send({ auth: true, token: token })
//     });
// });

// router.get('/me', function(req, res) {
    
//     const token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//     jwt.verify(token, secret, function (err, decoded) {
//         if (err) return res.status(500).send( { auth: false, message: 'Failed to authenticate token' });
        
//         User.findById(decoded.id, 
//             { password: 0 }, // projection 
//             function (err, user) {
//             if(err) return res.status(500).send('There was a problem finding the user');

//             res.status(200).send(user);
//         });
//     });
// });

// router.post('/login', function (req, res) {

//     User.findOne({ email: req.body.email }, function (err, user) {
//         if (err) return res.status(500).send('Server error.');
//         if (!user) return res.status(404).send('No user found.');

//         const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
//         if (!passwordIsValid) return res.status(401).send( {auth: false, token: null });

//         const token = jwt.sign({ id: user._id }, secret, {
//             expiresIn: 86400 // expires in 24 hours
//         });

//         res.status(200).send({ auth: true, token: token });
//     });
// });

// router.get('/logout', function (req, res) {
//     res.status(200).send({ auth: false, token: null });
// })

// module.exports = router;

