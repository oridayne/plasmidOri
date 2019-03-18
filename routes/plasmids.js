const Plasmids = require('../models/Plasmids');
const express = require('express');
const sanitizer = require('sanitizer');
const bcrypt = require('bcryptjs');
const salt = "$2a$10$abeepboopftahsdclposigtfi3";
const uuidv4 = require('uuid/v4');

const router = express.Router();


/**
 * Create a Plasmid, set plasmidID to current session plasmidID
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
  console.log(sanitizedPlasmidName, req.body.plasmidName, sanitizedUser);
  Plasmids.findOnePlasmid(sanitizedUser, sanitizedPlasmidName).then((response) => {
    console.log("in find one plasmid", response);
    if (response.length != 0) {
      res.status(409).json({
        error: 'A plasmid with that name already exists. Please enter a different one to create a plasmid.',
      }).end();
    } else if ((req.body.plasmidName!=null&&sanitizedPlasmidName.length < 1||req.body.plasmidName!=null&&sanitizedPlasmidName.indexOf(' ') >= 0)) {
        res.status(400).json({
          error: 'Plasmid must be at least 1 characters long each and not have any white space.',
        }).end();
    } 
      else {
        console.log("i am here in the last cond");
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
          req.session.plasmidID = randomID;
          res.status(200).json({message:"Plasmid sucessfully created", plasmidID:randomID, plasmidName:sanitizedPlasmidName}).end();
        })
    }
  });
});


/**
 * Find all plasmids under a user
 * @name GET /api/plasmids/all
 * @return {[Plasmid]} - all plasmids
 */
router.get('/all', (req, res)=>{
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  Plasmids.findAllPlasmidsFromUser(sanitizedUser).then((response)=>{
    res.status(200).json({message:"Plasmid found", response: response}).end();
  });
});


/**
 * Delete a plasmid
 * @name DELETE /api/plasmids/:plasmidName
 * @param {string} plasmidID
 * @return {200} - success message
 */
router.delete('/:plasmidID', (req, res) => {
  console.log("in delete plasmid");
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  const sanitizedID = sanitizer.sanitize(req.params.plasmidID);
  Plasmids.deletePlasmid(sanitizedUser, sanitizedID).then((response)=>{
    res.status(200).json({message:"Plasmid deleted"}).end();
  })
});


/**
 * Get current plasmid in the session
 * @name GET /api/plasmids/current
 * @throw {404} - no current plasmid or plasmid not found
 * @return {200} - current plasmid object, derived from req.session.plasmidID
 */
router.get('/current', (req, res) => {
  const sanitizedID = sanitizer.sanitize(req.session.plasmidID);
  const sanitizedUser = sanitizer.sanitize(req.session.name);

  if(req.session.plasmidID==null){
    res.status(404).json({error:"There is no current plasmid selected"});
  }
  else{
    Plasmids.findOnePlasmidByID(sanitizedID, sanitizedUser).then((response)=>{
      if(response.length==0){
        res.status(404).json({error:"no plasmid with ID" + sanitizedID+" was found"}).end();
      }
      else{
        res.status(200).json({message:"plasmid found!", response:response});
      }
    });
  }

});

/**
 * Get plasmid based on plasmid ID
 * @name GET /api/plasmids/plasmid/:plasmidID
 * @throw {404} - no current plasmid or plasmid not found
 * @return {200} - current plasmid object, derived from req.session.plasmidID
 */
router.get('/plasmid/:plasmidID', (req, res) => {
  const sanitizedID = sanitizer.sanitize(req.params.plasmidID);
  const sanitizedUser = sanitizer.sanitize(req.session.name);

  Plasmids.findOnePlasmidByID(sanitizedID, sanitizedUser).then((response)=>{
    if(response.length==0){
      res.status(404).json({error:"no plasmid with ID" + sanitizedID+" was found"}).end();
    }
    else{
      res.status(200).json({message:"plasmid found!", response:response});
    }
  });
  

});

/**
 * Set session variable for current plasmid
 * @name PUT /api/plasmids/plasmid/plasmidID/:plasmidID
 * @param{string} plasmidID - plasmidID to set in session variable
 * @throw{404} if plasmidID for that user is not found
 * @return {200} - success message
 */
router.put('/plasmid/plasmidID/:plasmidID', (req, res) => {
  console.log('setting plasmid ID session', req.params.plasmidID)
  const sanitizedPlasmidID = sanitizer.sanitize(req.params.plasmidID);
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  Plasmids.findOnePlasmidByID(sanitizedPlasmidID, sanitizedUser).then((response)=>{
    if(response.length==0){
      res.status(404).json({error:"plasmidID "+sanitizedPlasmidID+" does not exist"});
    }
    else{
      req.session.plasmidID = sanitizedPlasmidID;
      res.status(200).json({message:"session variable for plasmidID set!", plasmidID: sanitizedPlasmidID});
    }
  });
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
 * Change an the current plasmid's data
 * @name PUT /api/plasmids/plasmid
 * @param {string} sequence - new DNA sequence
 * @param {string} newPlasmidName - name of the plasmid
 * @param {int} interval - new interval of ticks on display
 * @param {int} minLength - new minimum length of orfs accepted
 * @param {string} annotations - new JSON string of object containing annotations information
 * @throws {404} plasmid not found
 * @return {new plasmid} - success message
 */
router.put('/plasmid', (req, res) => {
  console.log("made it in the put!!!");
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  const sanitizedNewPlasmidName = sanitizer.sanitize(req.body.newPlasmidName);
  const sanitizedSeq =  sanitizer.sanitize(req.body.sequence);
  const sanitizedInterval = sanitizer.sanitize(req.body.interval);
  const sanitizedMinLength = sanitizer.sanitize(req.body.minLength);
  const sanitizedAnnotations = sanitizer.sanitize(req.body.annotations);
  Plasmids.findOnePlasmidByID(req.session.plasmidID, sanitizedUser).then((response)=>{
    if(response.length==0){
      res.status(404).json({
        error: 'A plasmid with that ID:'+ req.session.plasmidID+ ' was not found!',
      }).end();
    }
    else{
      console.log("new name", sanitizedNewPlasmidName)
      Plasmids.updatePlasmidData(req.session.plasmidID, sanitizedUser, sanitizedSeq, sanitizedNewPlasmidName, sanitizedInterval, sanitizedMinLength, sanitizedAnnotations).then((response)=>{
        
        res.status(200).json({message:"Plasmid changed", response: response}).end();
      })
    }
  });
});

/**
 * Change an the current plasmid's annotation field
 * @name PUT /api/plasmids/plasmid/annotations
 * @param {string} annotations - new JSON string of object containing annotations information
 * @throws {404} plasmid not found
 * @return {new plasmid} - success message
 */
router.put('/plasmid/annotations', (req, res) => {
  console.log("made it in the put!!!");
  const sanitizedUser = sanitizer.sanitize(req.session.name);
  const sanitizedAnnotations = sanitizer.sanitize(req.body.annotations);
  Plasmids.findOnePlasmidByID(req.session.plasmidID, sanitizedUser).then((response)=>{
    if(response.length==0){
      res.status(404).json({
        error: 'A plasmid with that ID:'+ req.session.plasmidID+ ' was not found!',
      }).end();
    }
    else{
      Plasmids.updatePlasmidAnnotations(req.session.plasmidID, sanitizedUser, sanitizedAnnotations).then((response)=>{
        res.status(200).json({message:"Plasmid Annotation changed", response: response}).end();
      })
    }
  });
});
module.exports = router;