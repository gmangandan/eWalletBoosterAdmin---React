/* eslint-disable camelcase */
const Static = require('../admin_models/Static');

function getTurOverStaticText(req, res, next) {
    var query = { isDeleted: false, static_text_for: req.params.brand };


    Static.find(query)
        .then(accounts => {

            if (accounts.length === 0) throw { status: 404, msg: `There are no data ` };
            else return res.status(200).send({ accounts });
        }).catch(err => {
            console.log('err', err);
            if (err.status === 404) res.status(404).send({ success: false, msg: err.msg });
            else return next({ status: 500, message: 'server error' });
        });

}





module.exports = {
    getTurOverStaticText,

};

