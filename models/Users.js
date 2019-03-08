const database = require('../database');
const sqlite = require('sqlite3').verbose();
/**
 * @typedef User
 * @prop {string} username - username of user
 * @prop {string} password - password of user
 */

/**
 * @class Users
 * Stores all Users.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
  /**
   * Add a User.
   * @param {string} username - username of user
   * @param {string} password - password of user
   */
  static async addOneUser(username, password) {
    try {
      const safeUser = escape(username);
      const safePassword = escape(password);
      // const sql = `INSERT INTO users (username, password) VALUES (${safeUser}, ${safePassword});`;
      const sql = `INSERT INTO users (username, password) VALUES (?, ?);`;
      const response = await database.query(sql, [username, password]);
      console.log("created user!", response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a User by username.
   * @param {username} username - username of user
   * @return {User | []]} - found User
   */
  static async findOneUser(username) {
    try {
      const sql = `SELECT * FROM users WHERE username=(?);`;
      const response = await database.query(sql, [username]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return an array of all of the Users.
   * @return {User[]}
   */
  static async findAllUser() {
    try {
      const sql = `SELECT * FROM users;`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a Users username.
   * @param {string} currentUsername - username of logged-in user
   * @param {string} newUsername - new username to update with
   * @return {User | []} - updated User
   */
  static async updateUsernameOneUser(currentUsername, newUsername) {
    try {
      const sql = `UPDATE users SET username=(?) WHERE username=(?);`;
      const response = await database.query(sql, [currentUsername, newUsername]);
      return response;
    } catch (err) { throw err; }
  }

  /**
   * Update a Users password
   * @param {string} currentUsername - username of logged-in user
   * @param {string} newPassword - new password to update with
   * @return {User | []} - updated User
   */
  static async updatePasswordOneUser(currentUsername, newPassword) {
    try {
      const sql = `UPDATE users SET password=(?) WHERE username=(?);`;
      const response = await database.query(sql, [newPassword, currentUsername]);
      return response;
    } catch (err) { throw err; }
  }

  /**
   * Delete a User
   * @param {username} username - username of User to delete
   * @return {User | [} - found User
   */
  static async deleteOneUser(username) {
    try {
      const sql = `DELETE FROM users WHERE username=(?);`;
      const response = await database.query(sql, [username]);
      return response;
    } catch (err) { throw err; }
  }
}

module.exports = Users;