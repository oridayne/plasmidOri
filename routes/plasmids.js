const Plasmids = require('../models/Plasmids');
const express = require('express');
const sanitizer = require('sanitizer');
const bcrypt = require('bcryptjs');
const salt = "$2a$10$abeepboopftahsdclposigtfi3";
const uuidv4 = require('uuid/v4');

const router = express.Router();


/**
 * Create a Plasmid
 * @name POST /api/plasmids
 * @param {string} sequence - DNA sequence
 * @param {string} plasmidName - name of the plasmid
 * @param {int} interval - interval of ticks on display
 * @param {int} minLength - minimum length of orfs accepted
 * @param {string} annotations - JSON string of object containing annotations information
 * @return {Plasmid} - the created Plasmid
 * @throws {400} - if plasmid name is not at least 1 character long/has white space
 * @throws {409} - if plasmidName is already taken
 */
router.post('/', (req, res) => {
  const sanitizedPlasmidName = sanitizer.sanitize(req.body.plasmidName);
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  console.log("current session name is", req.session);
  Plasmids.findOnePlasmid(sanitizedUser, sanitizedPlasmidName).then((response) => {
    if (response.length != 0) {
      res.status(409).json({
        error: 'A plasmid with that name already exists. Please enter a different one to create a plasmid.',
      }).end();
    } else if (sanitizedPlasmidName.length < 1||sanitizedPlasmidName.indexOf(' ') >= 0) {
      res.status(400).json({
        error: 'Plasmid must be at least 1 characters long each and not have any white space.',
      }).end();
    } 
      else {
        const sanitizedSeq =  sanitizer.sanitize(req.body.sequence);
        const randomID = uuidv4(); 
        const sanitizedInterval = sanitizer.sanitize(req.body.interval);
        const sanitizedMinLength = sanitizer.sanitize(req.body.minLength);
        const sanitizedAnnotations = sanitizer.sanitize(req.body.annotations);
        Plasmids.createPlasmid(randomID, 
                              sanitizedUser, 
                              sanitizedSeq, 
                              sanitizedPlasmidName, 
                              sanitizedInterval, 
                              sanitizedMinLength, 
                              sanitizedAnnotations).then((response)=>{
          res.status(200).json({message:"Plasmid sucessfully created", plasmidID:randomID}).end();
        })
    }
  });
});

/**
 * Find a plasmid based on name by user
 * @name GET /api/plasmids/:plasmidName
 * @param{string} plasmiName
 * @return {Plasmid} - the plasmid with that name
 * @throws {404} - if plasmid is not found
 */
router.get('/plasmid/:plasmidName', (req, res)=>{
  const sanitizedPlasmidName = sanitizer.sanitize(req.params.plasmidName);
  const sanitizedUser = sanitizer.sanitize(req.session.name);

  Plasmids.findOnePlasmid(sanitizedUser, sanitizedPlasmidName).then((response)=>{
    if(response.length==0){
      res.status(404).json({
        error: 'A plasmid with that name was not found!',
      }).end();
    }
    else{
      console.log("here is the plasmid!: ", response);
      res.status(200).json({message:"Plasmid found", response: response}).end();
    }
  });
});

/**
 * Find all plasmids under a user
 * @name GET /api/plasmids/all
 * @return {[Plasmid]} - all plasmids
 */
router.get('/all', (req, res)=>{
  console.log("blah! blah blah");
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  console.log("i am here? getting all?", req.session.name);
  Plasmids.findAllPlasmidsFromUser(sanitizedUser).then((response)=>{
    console.log("here are all the plasmids: ", response);
    res.status(200).json({message:"Plasmid found", response: response}).end();
  });
});


/**
 * Delete a plasmid
 * @name DELETE /api/plasmids/delete/:plasmidName
 * @param {string} plasmidName 
 * @return {200} - success message
 */
router.delete('/delete/:plasmidName', (req, res) => {
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  const sanitizedPlasmidName = sanitizer.sanitize(req.params.plasmidName);
  Plasmids.deletePlasmid(sanitizedUser, sanitizedPlasmidName).then((response)=>{
    res.status(200).json({message:"Plasmid deleted"}).end();
  })
});


/**
 * Change an exisiting plasmid's name
 * @name PUT /api/plasmids/plasmidName
 * @param{string} plasmidName
 * @param{string} new plasmid name
 * @throws {404} plasmid not found
 * @return {new plasmid} - success message
 */
router.put('/plasmidName', (req, res) => {
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  const sanitizedPlasmidName = sanitizer.sanitize(req.body.plasmidName);
  const sanitizedNewPlasmidName = sanitizer.sanitize(req.body.newPlasmidName);
  Plasmids.findOnePlasmid(sanitizedUser, sanitizedPlasmidName).then((response)=>{
    if(response.length==0){
      res.status(404).json({
        error: 'A plasmid with that name was not found!',
      }).end();
    }
    else{
      Plasmids.updatePlasmidName(sanitizedUser, sanitizedPlasmidName, sanitizedNewPlasmidName).then((response)=>{
        res.status(200).json({message:"Plasmid name changed", response: response}).end();
      })
    }
  });
});


/**
 * Change an existing plasmid's data
 * @name PUT /api/plasmids/plasmidName
 * @param {string} sequence - new DNA sequence
 * @param {string} plasmidName - name of the plasmid
 * @param {int} interval - new interval of ticks on display
 * @param {int} minLength - new minimum length of orfs accepted
 * @param {string} annotations - new JSON string of object containing annotations information
 * @throws {404} plasmid not found
 * @return {new plasmid} - success message
 */
router.put('/plasmid', (req, res) => {
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  const sanitizedPlasmidName = sanitizer.sanitize(req.body.plasmidName);
  const sanitizedNewPlasmidName = sanitizer.sanitize(req.body.newPlasmidName);
  const sanitizedSeq =  sanitizer.sanitize(req.body.sequence);
  const sanitizedInterval = sanitizer.sanitize(req.body.interval);
  const sanitizedMinLength = sanitizer.sanitize(req.body.minLength);
  const sanitizedAnnotations = sanitizer.sanitize(req.body.annotations);
  Plasmids.findOnePlasmid(sanitizedUser, sanitizedPlasmidName).then((response)=>{
    if(response.length==0){
      res.status(404).json({
        error: 'A plasmid with that name was not found!',
      }).end();
    }
    else{
      Plasmids.updatePlasmidData(sanitizedUser, sanitizedSeq, sanitizedPlasmidName, sanitizedInterval, sanitizedMinLength, sanitizedAnnotations).then((response)=>{
        res.status(200).json({message:"Plasmid changed", response: response}).end();
      })
    }
  });
});
module.exports = router;