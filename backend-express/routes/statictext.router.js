const express = require('express');
const router = express.Router();
const {
    getTurOverStaticText   
} = require('../controllers/statictext.controller');

// GET applications by brand
router.get('/:brand', getTurOverStaticText);


module.exports = router;
