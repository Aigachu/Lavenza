/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Right now she is quite literally a copy paste of the good old legendary MaidenCooldownManager.
 *
 * NEEDS A REVAMP. @TODO
 */
export class Makoto {

  /**
   * Store cooldowns in an object.
   */
  public static cooldowns: {};

  /**
   * Constructor for the CooldownManager class.
   * Takes the client of the bot as an argument.
   */
  public static async build(): Promise<void> {
    // Instantiate the cooldowns object.
    Makoto.cooldowns = {}; // @TODO - Save cooldowns in a database file.
  }

  /**
   * Set a cooldown for a given command, scope and duration.
   */
  public static set(bot: string, type: string, key: string, scope: string | number, duration: number): Promise<void> {
    if (!(bot in Makoto.cooldowns)) {
      Makoto.cooldowns[bot] = {};
    }

    // Set object for this cooldown type if it doesn't exist.
    if (!(type in Makoto.cooldowns[bot])) {
      Makoto.cooldowns[bot][type] = {};
    }

    // Initialize array for this cooldown key if it doesn't exist.
    if (!(key in Makoto.cooldowns[bot][type])) {
      Makoto.cooldowns[bot][type][key] = [];
    }

    // Set the cooldown into the array.
    Makoto.cooldowns[bot][type][key].push(scope);

    // Start the countdown for the duration.
    // Note: Not sure why I use a promise here. I think I wanted to be cool. ¯\_(ツ)_/¯
    return new Promise((resolve: () => void, reject: () => void): void => {
      setTimeout(() => {
        Makoto.unset(bot, type, key, scope);
        resolve(); // Yay! Everything went well!
        reject(); // Ugh...
      },         duration);
    });
  }

  /**
   * Unset a cooldown for a given command, user and scope.
   */
  public static unset(bot: string, type: string, key: string, scope: string | number): void {
    // Remove the cooldown.
    Makoto.cooldowns[bot][type][key].splice(Makoto.cooldowns[bot][type][key].indexOf(scope), 1);
  }

  /**
   * Check if a cooldown exists with the given parameters.
   */
  public static check(bot: string, type: string, key: string, scope: string | number): boolean {
    if (!(bot in Makoto.cooldowns)) {
      return false;
    }

    // If the type isn't set, then the cooldown surely isn't set.
    // For example, if a command is called,
    // But the 'cooldown' type isn't found, then there are no cooldowns for commands at all.
    if (!(type in Makoto.cooldowns[bot])) {
      return false;
    }

    // If the key isn't set, then the cooldown surely isn't set.
    // For example, if for the ping command,
    // The key 'ping' isn't found, then there are no cooldowns for the ping command.
    if (!(key in Makoto.cooldowns[bot][type])) {
      return false;
    }

    // Returns whether or not the cooldown exists.
    return Makoto.cooldowns[bot][type][key].indexOf(scope) > -1;
  }

}
