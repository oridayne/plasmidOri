const express = require('express');

const router = express.Router();

const session = require('express-session');

const uuid = require('uuid');

const csurf = require('csurf');


router.use(session({secret: "origami"}));


/* GET home page. */
router.get('/', (req, res) => {
  res.render('play', { title: 'plasmid'});
});

/* GET home page. */
router.get('/edit', (req, res) => {
  res.render('index', { title: 'plasmid'});
});

module.exports = router;
