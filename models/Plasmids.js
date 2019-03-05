const database = require('../database');
const sqlite = require('sqlite');

/**
 * @typedef Plasmid
 * @prop {string} username - username of user
 * @prop {string} sequence - DNA sequence
 * @prop {string} plasmidName - name of plasmid
 * @prop {int} interval - interval of tick marks on viz
 * @prop {int} minLength - minimum length of ORFs shown
 * @prop {string} annotations - stringified version of list of objects detailing annotations 
 */

/**
 * @class Plasmids
 * Stores all plasmids
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */

class Plasmids{

  
}