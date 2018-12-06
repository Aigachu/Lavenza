/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Right now she is quite literally a copy paste of the good old legendary MaidenCooldownManager.
 *
 * NEEDS A REVAMP. @todo
 */
export default class Makoto {

  /**
   * Constructor for the CooldownManager class.
   * Takes the client of the bot as an argument.
   */
  static async build() {
    // Instantiate the cooldowns object.
    this.cooldowns = {}; // @TODO - Save cooldowns in a database file.
  }

  /**
   * Set a cooldown for a given command, scope and duration.
   * @param {String}          type     Type of cooldown.
   * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
   * @param {String/Number}   scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
   * @param {Number}          duration Lifetime of the cooldown.
   */
  static set(bot, type, key, scope, duration) {

    if (!(bot in this.cooldowns)) {
      this.cooldowns[bot] = {};
    }

    // Set object for this cooldown type if it doesn't exist.
    if (!(type in this.cooldowns[bot])) {
      this.cooldowns[bot][type] = {};
    }

    // Initialize array for this cooldown key if it doesn't exist.
    if (!(key in this.cooldowns[bot][type])) {
      this.cooldowns[bot][type][key] = [];
    }

    // Set the cooldown into the array.
    this.cooldowns[bot][type][key].push(scope);

    // Start the countdown for the duration.
    // Note: Not sure why I use a promise here. I think I wanted to be cool. ¯\_(ツ)_/¯
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.unset(bot, type, key, scope);
        resolve("Remove cooldown now!"); // Yay! Everything went well!
        reject("Something went wrong!"); // Ugh...
      }, duration);
    });
  }

  /**
   * Unset a cooldown for a given command, user and scope.
   * @param {String}          type     Type of cooldown.
   * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
   * @param {String/Number}  scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
   */
  static unset(bot, type, key, scope) {

    // Remove the cooldown.
    this.cooldowns[bot][type][key].splice(this.cooldowns[bot][type][key].indexOf(scope), 1);

  }

  /**
   * Check if a cooldown exists with the given parameters.
   * @param {String}          type     Type of cooldown.
   * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
   * @param {String/Number}  scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
   */
  static check(bot, type, key, scope) {

    if (!(bot in this.cooldowns)) {
      return false;
    }

    // If the type isn't set, then the cooldown surely isn't set.
    // For example, if a command is called,
    // but the 'cooldown' type isn't found, then there are no cooldowns for commands at all.
    if (!(type in this.cooldowns[bot])) {
      return false;
    }

    // If the key isn't set, then the cooldown surely isn't set.
    // For example, if for the ping command,
    // the key 'ping' isn't found, then there are no cooldowns for the ping command.
    if (!(key in this.cooldowns[bot][type])) {
      return false;
    }

    // Returns whether or not the cooldown exists.
    return (this.cooldowns[bot][type][key].indexOf(scope) > -1);

  }
}