const Prototypes = require('../models/Prototypes');
const Plasmids = require('../models/Plasmids');

const express = require('express');
const sanitizer = require('sanitizer');
const bcrypt = require('bcryptjs');
const salt = "$2a$10$abcdasdftahsdclposigtfi3";

const router = express.Router();


/**
 * Get all the prototypes
 * @name GET/api/prototypes
 * @return {[Prototype]|[]} - list of all the prototypes
 */
router.get('', (req, res)=>{
  Prototypes.findAllPrototypes().then((response)=>{
    res.status(200).json({
        message: 'All prototypes returned',
        response:response
      }).end();
  })
});



module.exports = router;