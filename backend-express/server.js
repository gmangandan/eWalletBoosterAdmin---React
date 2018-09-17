const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cron = require('node-cron');
const cors = require('cors');
const csv = require("csv");
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const adminRoutes = require('./admin_routes/router');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const helmet = require('helmet');
const {errorHandler} = require('./lib/data.helpers');
const DB_URL = process.env.MONGODB_URI;
const {LOCAL_DB_URL} = require('./config/config');
const {fetchDailyNetellerAccounts} = require('./queries/neteller-daily');
const {fetchMonthlyNetellerAccounts} = require('./queries/neteller-monthly');
// connect to MongoDB

mongoose.connect('mongodb://localhost:27017/ewallet-cashback', { useNewUrlParser: true });
// file upload
app.use(fileUpload());
// use cors and helmet
app.use(cors());
app.use(helmet());

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// serve static files from template
app.set('view engine', 'ejs');
app.use(express.static('public'));

// include routes 
app.use('/', routes);
app.use('/', adminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// schedule taks to be run on the server
cron.schedule('* * * * *', function () {
    console.log('running every minute')
    // fetchMonthlyNetellerAccounts()
    fetchDailyNetellerAccounts()
})

// define as the last app.use callback
// catch all error handler - any 500 errors
app.use(errorHandler);

// connect to app
const port = process.env.PORT || 3000;
app.listen(port, function () {
        console.log('App listening on port...' + port);    
});
