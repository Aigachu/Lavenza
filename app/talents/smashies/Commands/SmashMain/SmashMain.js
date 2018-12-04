/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import fs from 'fs';
import DiscordJS from 'discord.js';

/**
 * Smash Main command.
 *
 * Selects a main for you!
 */
class SmashMain extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // Path to the Smash 4 Portraits Directory.
    let smash4PortraitsDirectory = this.talent.directory + '/assets/portraits/smash4';

    // Build the suspense...
    resonance.message.reply("! Your new main is..._drumroll_");

    // Get the random main.
    let file = this.getRandomPortraitFromDirectory(smash4PortraitsDirectory);

    // Build Discord Attachment.
    let attachment = new DiscordJS.Attachment(file);

    // Send the main.
    resonance.message.channel.send(attachment)
      .then((message) => {
        // Do nothing.
      }).catch(console.error);
  }

  /**
   * Crawls the assets directory and returns a random file from within a subdirectory.
   *
   * @param {string} directory
   *   Path to the directory containing the sub directories.
   */
  static getRandomPortraitFromDirectory(directory) {

    // Get the list of sub directories from the directory.
    let subDirectories = fs.readdirSync(directory);

    // Get a random sub directory from the list of directories nested in the provided directory.
    // It makes sense...Just read it again...
    let subDirectoryName = subDirectories[Math.floor(Math.random() * subDirectories.length)];

    // Get the list of files from the randomly selected sub directory.
    let files = fs.readdirSync(directory + '/' + subDirectoryName);

    // Select a random file from within the randomly selected sub directory.
    let file = files[Math.floor(Math.random() * files.length)];

    // Return full path to the file.
    return directory + '/' + subDirectoryName + '/' + file;

  }

}

module.exports = SmashMain;