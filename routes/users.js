const Users = require('../models/Users');
const express = require('express');
const sanitizer = require('sanitizer');
const bcrypt = require('bcryptjs');
const salt = "$2a$10$abcdasdftahsdclposigtfi3";

const router = express.Router();


/**
 * Create a User.
 * @name POST/api/users
 * @param {string} username - username of user
 * @param {string} password - password of user
 * @return {User} - the created user
 * @throws {400} - if username or password are not both at least 3 characters long each
 * @throws {409} - if username is already taken
 */
router.post('/', (req, res) => {
  console.log("creating user");
  Users.findOneUser(req.body.username).then((response) => {
    if (response.length != 0) {
      console.log("user already exists?");
      res.status(409).json({
        error: 'An account with the username you entered already exists. Please enter a different one to create an account.',
      }).end();
    } else if (req.body.username.length < 3 || req.body.password.length < 3 ) {
      res.status(400).json({
        error: 'Username and password must be at least 3 characters long each.',
      }).end();
    } else {
      const sanitizedUser = sanitizer.sanitize(req.body.username);
      const sanitizedPass = sanitizer.sanitize(req.body.password);
      const hashedPass = bcrypt.hashSync(sanitizedPass, salt);
      Users.addOneUser(sanitizedUser, hashedPass).then(() => {
        req.session.name = sanitizedUser;
        res.status(200).json({
          message: 'Account successfully created.',
        }).end();
      });
    }
  });
});

/**
 * Get a logged-in user's username.
 * @name GET/api/users
 * @return {username} - the username of logged in account
 * @throws {403} - if user is not logged in
 */
router.get('', (req, res)=>{
  if(!req.session || !req.session.name){
    res.status(403).send({error: "Must log in"});
  }
  else{
    res.status(200).send(req.session.name);
  }
});

/*
* Signs in a user
* @param{string} username - username to be signed in
* @param{string} password  
* @return{200} on success
* @throw{404} if user not found
* @throw{400} password mismatch
*/

router.post('/signIn', (req,res)=>{
  const sanitizedUser= sanitizer.sanitize(req.body.username);
  console.log("sanitizedUser", sanitizedUser);
  Users.findOneUser(sanitizedUser).then((response)=>{
    if(response.length==0){
      res.status(404).send({error:"User not found"});
    }
    else{
      // 
      const dbPassHash = response[0].password;
      const sanitizedPass = sanitizer.sanitize(req.body.password);
      const isEqual = bcrypt.compareSync(sanitizedPass, dbPassHash); 
      if(isEqual){
         console.log("user is now signe din!");

        req.session.name=sanitizedUser;
        res.status(200).send({message:"User is now signed in"});
      }
      else{
        res.status(400).send({error:"Wrong password"});
      }
    }
  });
});


/**
 * Change a User's username.
 * @name PUT/api/users/current/username
 * @param {string} username - new username of user
 * @return {User} - the user with new username
 * @throws {400} - if new username is not at least 3 characters long
 * @throws {401} - if user tries to change username without being logged in
 * @throws {409} - if new username is already taken
 */

router.put('/current/username', (req, res) => {
  if (!req.session || !req.session.name) {
    res.status(401).json({
      error: 'Please log in to your account in order to change its username.',
    }).end();
  } else if (!req.body.username || req.body.username.length < 3) {
    res.status(400).json({
      error: 'Please enter a username that is 3 or more characters long.',
    }).end();
  } else {
    Users.findOneUser(req.body.username).then(response => {
    if (response.length != 0) {
      res.status(409).json({
        error: 'An account with the username you entered already exists. Please enter a different one to create an account.',
      }).end();
    } else {
      const sanitizedUser = sanitizer.sanitize(req.body.username);
      Users.updateUsernameOneUser(req.session.name, sanitizedUser).then(() => {
        req.session.name = sanitizedUser;
        res.status(200).json({
          message: 'Username successfully changed.',
        }).end();
      });
    }
  });
}});

/**
 * Change a User's password.
 * @name PUT/api/users/current/password
 * @param {string} password - new password of user
 * @return {User} - the user with new password
 * @throws {400} - if new password is not at least 3 characters long
 * @throws {401} - if user tries to change password without being logged in
 */
router.put('/current/password', (req, res) => {
  if (!req.session || !req.session.name) {
    res.status(401).json({
      error: 'Please log in to your account in order to change its password.',
    }).end();
  } else if (!req.body.password || req.body.password.length < 3) {
    res.status(400).json({
      error: 'Please enter a password that is 3 or more characters long.',
    }).end();
  } else {
    const sanitizedPass = sanitizer.sanitize(req.body.password);
    const hashedPass = bcrypt.hashSync(sanitizedPass, salt);
    Users.updatePasswordOneUser(req.session.name, hashedPass).then(() => {
      res.status(200).json({
        message: 'Password successfully changed.',
      }).end();
    });
  }
});

/**
 * Set username of active user in current session.
 * @name POST/api/users/signin
 * @return {User} - the user you just logged into
 * @throws {400} - if try to sign in to account that you are already signed in for
 * @throws {401} - if enter an incorrect password
 * @throws {404} - if try to sign in to an account that does not exist
 */
router.post('/signin', (req, res) => {
  const sanitizedUser = sanitizer.sanitize(req.body.username);
  Users.findOneUser(sanitizedUser).then((response) => {
    if (response.length === 0) {
      res.status(404).json({
        error: 'The username you entered does not exist.',
      }).end();
    }
    else {
      const dbPassHash = response[0].password;
      const sanitizedPass = sanitizer.sanitize(req.body.password);
      const isEqual = bcrypt.compareSync(sanitizedPass, dbPassHash);
      if (!req.body.password || !isEqual) {
        res.status(401).json({
          error: 'The password you entered was incorrect. Please try again.',
        }).end();
      } else {
        req.session.name = sanitizedUser;
        res.status(200).json({
          message: 'You have successfully logged in.',
        }).end();
      }
    }
  });
});

/**
 * Sign out of active user in current session.
 * @name POST/api/users/signout
 * @throws {400} - if you try to sign out when you aren't signed in
 */
router.post('/signout', (req, res) => {
  if (!req.session || !req.session.name) {
    res.status(400).json({
      error: `You cannot log out when you are not logged in.`,
    }).end();
  } else {
    req.session.name = "";
    res.status(200).json({
      message: 'You have successfully logged out.',
    }).end();
  }
});

/**
 * Delete a user
 * @name DELETE/api/users/delete
 * @return {User} - the deleted user
 * @throws {401} - if try to delete without being logged in
 */
router.delete('/delete', (req, res) => {
  if (!req.session || !req.session.name) {
    res.status(401).json({
      error: 'Please log in to your account in order to delete it.',
    }).end();
  } else {
    Users.deleteOneUser(req.session.name).then(() => {
      req.session.name = "";
      res.status(200).json({
        message: 'Account successfully deleted. You are now logged out.',
      }).end();
    });
  }
});

module.exports = router;