const database = require('../database');
const sqlite = require('sqlite3').verbose();
/**
 * @typedef Prototype
 * @prop {string} name - name of prototype enzyme
 * @prop {string} sequence - sequence, along with cut site and annotations from REBASE
 * @prop {string} plainSequence - sequence with only letters
 * @prop {int} type - type of enzyme
 */

/**
 * @class Prototypes
 * Stores all Prototypes
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Prototypes {
  /**
   * Add a Prototype.
   * @param {string} name - name of prototype
   * @param {string} sequence - sequence, along with cut site and annotations from REBASE
   * @param {string} plainSequence - sequence with only letters
   * @param {int} type - type of enzyme
   */
  static async addOnePrototype(name, sequence, plainSequence, type) {
    try {
      // const sql = `INSERT INTO users (username, password) VALUES (${safeUser}, ${safePassword});`;
      const sql = `INSERT INTO prototypes (name, sequence, plainSequence, type) VALUES (?, ?, ?, ?);`;
      const response = await database.query(sql, [name, sequence, plainSequence, type]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a prototype by name
   * @param {string} name - name of prototype
   * @return {Prototype | []]} - found proto
   */
  static async findOnePrototype(name) {
    try {
      const sql = `SELECT * FROM prototypes WHERE name=(?);`;
      const response = await database.query(sql, [name]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a prototype by sequence
   * @param {string} sequence - seq of prototype
   * @return {Prototype | []]} - found proto
   */
  static async findOnePrototypeBySeq(seq) {
    try {
      const sql = `SELECT * FROM prototypes WHERE plainSequence=(?);`;
      const response = await database.query(sql, [seq]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return an array of all of the Prototypes.
   * @return {Prototype[]}
   */
  static async findAllPrototypes() {
    try {
      const sql = `SELECT * FROM prototypes;`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a prototype
   * @param {name} name - name of proto to delete
   * @return {Proto | [} - found proto that is deleted
   */
  static async deleteOneUser(username) {
    try {
      const sql = `DELETE FROM prototypes WHERE name=(?);`;
      const response = await database.query(sql, [name]);
      return response;
    } catch (err) { throw err; }
  }
}

module.exports = Prototypes;