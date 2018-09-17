var apassport = require('passport');
require('../config/admin_passport')(apassport);
const Static = require('../admin_models/Static');
const { getToken } = require('../utils/api.helpers');
function getstaticText(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        let pageLimit = parseInt(req.query.pageLimit);
        let skippage = pageLimit * (req.query.page - 1);
        var query = { isDeleted: false };
        if (req.query.searchKey && req.query.searchBy) {
            query[req.query.searchBy] = new RegExp(req.query.searchKey, 'i');
        }
        Static.find(query).skip(skippage).limit(pageLimit)
            .then(results => {
                if (results.length === 0) return res.status(200).send({ success: false, 'results': [], totalCount: 0 });
                Static.count(query).then(staticCounts => {
                    return res.status(200).send({ success: true, 'results': results, totalCount: staticCounts });
                });
            }).catch((err) => {
                return res.json({ success: false, msg: 'Server error' });
            });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function getstaticRowById(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        Static.findById(req.query._id, { password: 0 }).then(staticRow => {
            if (staticRow.length === 0) return res.status(200).send({ success: false });
            return res.status(200).send({ success: true, 'results': staticRow });
        }).catch(() => {
            return res.json({ success: false, msg: 'Server error' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function createstaticText(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { static_text_for, static_text, static_text_min_val, static_text_max_val } = body.staticData;
        if (!static_text_for) return res.send({ success: false, message: 'Please select text for.' });
        if (!static_text) return res.send({ success: false, message: 'Please enter your staticname.' });

        const newStatic = new Static();
        newStatic.static_text_for = static_text_for;
        newStatic.static_text = static_text;
        newStatic.static_text_min_val = static_text_min_val;
        newStatic.static_text_max_val = static_text_max_val;

        newStatic.save((err, doc) => {
            if (err) {
                return res.status(400).send({ success: true, msg: 'Server error!' });
            }
            return res.status(201).send({ success: true, msg: 'Text created successfully!' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function updatestaticText(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { _id, static_text_for, static_text, static_text_min_val, static_text_max_val } = body.staticData;
        if (!static_text_for) return res.send({ success: false, message: 'Please select text for.' });
        if (!static_text) return res.send({ success: false, message: 'Please enter your staticname.' });
        Static.findById({
            _id
        }).then(static => {
            if (!static) throw { status: 400, msg: 'Invalid id.' };
            let updateData = {
                static_text_for: static_text_for,
                static_text: static_text,
                static_text_min_val: static_text_min_val,
                static_text_max_val: static_text_max_val,

            };

            Static.findByIdAndUpdate({ _id: static._id }, { $set: updateData })
                .then(() => {
                    return res.status(201).send({ success: true, msg: 'Static text updated successfully!' });
                }).catch(() => {
                    return res.json({ success: false, msg: 'Server error' });
                });
        }).catch(err => {
            if (err.status === 400) res.status(400).send({ success: false, msg: err.msg });
            else return next({ status: 500, message: 'Server error' });
        })
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function deletestaticText(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { _id } = body;
        if (!_id) return res.send({ success: false, message: 'ID missing.' });
        Static.findById({ _id }).then(static => {
            if (!static) throw { status: 400, msg: 'Invalid Static.' };
            updateData = { isDeleted: true };
            Static.findByIdAndUpdate({ _id: static._id }, { $set: updateData })
                .then(() => {
                    return res.status(201).send({ success: true, msg: 'Static text deleted successfully!' });
                }).catch(() => {
                    return res.json({ success: false, msg: 'Server error' });
                });
        }).catch(() => {
            return res.json({ success: false, msg: 'Server error' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}



module.exports = {
    getstaticText,
    createstaticText,
    updatestaticText,
    getstaticRowById,
    deletestaticText,

};
