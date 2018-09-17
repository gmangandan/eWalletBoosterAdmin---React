const {User} = require('../models/index');
const {getToken} = require('../utils/api.helpers');

// GET all the users from database
function getUser (req, res, next) {
    const token = getToken(req.headers);    
    if (token) { 
        // the user object is collected via passport middleware and returned in req.user object
        return User.findOne({email: req.user.email}, { password: 0 })
        // excluding the password from being sent to client by adding in the {password: 0} as the second argument of the query
        .then(user => { 
            return res.status(200).send({user});
        })
        .catch(() => next({status: 500, message: 'server error'}));
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorised'});
    }    
}

module.exports = {
    getUser
}
