const database = require('../database');
const sqlite = require('sqlite');

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
      const safeUser = sqlite.escape(username);
      const safePassword = sqlite.escape(password);
      const sql = `INSERT INTO users (username, password) VALUES (${safeUser}, ${safePassword});`;
      const response = await database.query(sql);
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
      const safeUser = sqlite.escape(username);
      const sql = `SELECT * FROM users WHERE username=${safeUser};`;
      const response = await database.query(sql);
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
      const safeCurrentUser = sqlite.escape(currentUsername);
      const safeNewUser = sqlite.escape(newUsername);
      const sql = `UPDATE users SET username=${safeNewUser} WHERE username=${safeCurrentUser};`;
      const response = await database.query(sql);
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
      const safeCurrentUser = sqlite.escape(currentUsername);
      const safeNewPassword = sqlite.escape(newPassword);
      const sql = `UPDATE users SET password=${safeNewPassword} WHERE username=${safeCurrentUser};`;
      const response = await database.query(sql);
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
      const safeUser = sqlite.escape(username);
      const sql = `DELETE FROM users WHERE username=${safeUser};`;
      const response = await database.query(sql);
      return response;
    } catch (err) { throw err; }
  }
}

module.exports = Users;