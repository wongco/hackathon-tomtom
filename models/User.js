// const db = require('../db');

// class models
const APIError = require('./ApiError');

/** User on the site */

class User {
  constructor({ name, username, friends, songlist }) {
    this.username = username;
    this.name = name;
    this.friends = friends;
    this.songlist = songlist;
  }

  /** @description addUser - adds a user to the database
   * @property {object} user
   * @property {string} user.username
   * @property {string} user.name
   * @property {array} user.friends
   * @property {array} user.songlist
   * @return {Promise <User ({ name, username, friends, songlist })>}
   */
  static async addUser({ name, username, friends, songlist = [] }) {
    return new User({ name, username, friends, songlist });
  }
}

module.exports = User;
