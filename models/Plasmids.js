const database = require('../database');
const sqlite = require('sqlite3').verbose();

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

  /**
   * Create a plasmid
   * @param {string} randomly generated uuuid
   * @param {string} username - username of user
   * @param {string} sequence - DNA sequence
   * @param {string} plasmidName - name of the plasmid
   * @param {int} interval - interval of ticks on display
   * @param {int} minLength - minimum length of orfs accepted
   * @param {string} annotations - JSON string of object containing annotations information
   */
  static async createPlasmid(uuid, username, sequence, plasmidName, interval, minLength, annotations) {
    try {
      const sql = `INSERT INTO plasmids (uuid, username, sequence, plasmidName, interval, minLength, annotations) VALUES (?, ?, ?, ?, ?, ?, ?);`;
      const response = await database.query(sql,[uuid, username, sequence, plasmidName, interval, minLength, annotations]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a plasmid given plasmidName and username
   * @param {string} username - username of user
   * @param {string} plasmidName - name of the plasmid
   */
  static async findOnePlasmid(username, plasmidName) {
    try {
      const sql = `SELECT * FROM plasmids WHERE username=(?) AND plasmidName=(?);`;
      const response = await database.query(sql, [username, plasmidName]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a plasmid given plasmidID
   * @param {string} plasmidID 
   * @param {string} username
   */
  static async findOnePlasmidByID(plasmidID, username) {
    try {
      const sql = `SELECT * FROM plasmids WHERE uuid=(?) AND username=(?);`;
      const response = await database.query(sql, [plasmidID, username]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update plasmid name
   * @param {string} username - username of user
   * @param {string} plasmidName - current name of the plasmid
   * @param {string} newPlasmidName - new name of the plasmid
   */
  static async updatePlasmidName(username, plasmidName, newPlasmidName) {
    try {
      const safeUser = sqlite.escape(username);
      const safeSeq = sqlite.escape(sequence);
      const safePlasmidName = sqlite.escape(plasmidName);
      const safeNewPlasmidName = sqlite.escape(newPlasmidName);
      const sql = `UPDATE plasmids SET plasmidName=${safeNewPlasmidName} WHERE username=${safeUser} AND plasmidName=${safePlasmidName};`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the data held in a plasmid
   * @param {string} plasmidID - id of plasmid to change
   * @param {string} username - username of user
   * @param {string} sequence - new DNA sequence
   * @param {string} plasmidName - current name of the plasmid
   * @param {int} interval - new interval of ticks on display
   * @param {int} minLength - new minimum length of orfs accepted
   * @param {string} annotations - new JSON string of object containing annotations information
   */
  static async updatePlasmidData(plasmidID, username, sequence, plasmidName, interval, minLength, annotations) {
    try {
      console.log("new plasmid name", plasmidName);
      const sql = `UPDATE plasmids SET sequence=(?), interval=(?), minLength=(?), annotations=(?), plasmidName=(?) WHERE username=(?) AND uuid=(?);`;
      const response = await database.query(sql, [sequence, interval, minLength, annotations, plasmidName, username, plasmidID]);
      return response;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Updates the annotation field in a plasmid
   * @param {string} plasmidID - id of plasmid to change
   * @param {string} username - username of user
   * @param {string} annotations - new JSON string of object containing annotations information
   */
  static async updatePlasmidAnnotations(plasmidID, username, annotations) {
    try {
      const sql = `UPDATE plasmids SET annotations=(?) WHERE username=(?) AND uuid=(?);`;
      const response = await database.query(sql, [annotations, plasmidName, username, plasmidID]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all plasmids made by a user
   * @param {string} username - username of user
   */
  static async findAllPlasmidsFromUser(username) {
    try {
      const sql = `SELECT * FROM plasmids WHERE username=(?);`;
      const response = await database.query(sql, [username]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * delete a plasmid
   * @param {string} username - username of user
   * @param {string} plasmidID - ID  of the plasmid
   */
  static async deletePlasmid(username, plasmidID) {
    try {
      const sql = `DELETE FROM plasmids WHERE username=(?) AND uuid=(?);`;
      const response = await database.query(sql, [username, plasmidID]);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Plasmids;