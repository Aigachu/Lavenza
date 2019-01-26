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
 * @TODO - Major refactoring incoming!
 *  - First, we want to be able to select which game to select a new main for.
 *  - Next, we need to have a class (Fighter) for each character object and save their information in the database.
 *  - Next, we need to have a class (Game/Title) for each smash game, and customize their icon and name.
 *
 * Selects a main for you!
 */
export default class SmashMain extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // Path to the Smash 4 Portraits Directory.
    let smash4PortraitsDirectory = this.talent.directory + '/assets/portraits/ultimate';

    // Get the random main.
    let character = this.getRandomCharacterPortraitFromDirectory(smash4PortraitsDirectory);

    // Build Discord Attachment.
    let attachment = new DiscordJS.Attachment(character.portrait, character.filename);

    // Depending on client we act differently.
    switch (resonance.client.type) {

      // If we're in Discord..
      case Lavenza.ClientTypes.Discord: {
        resonance.client.sendEmbed(resonance.message.channel, {
          title: character.name,
          header: {
            text: await Lavenza.__('Super Smash Bros. Ultimate', resonance.locale),
            icon: 'attachment://icon.png'
          },
          footer: {
            text: await Lavenza.__(`{{user}}'s new main character!`, {user: resonance.message.author.username}, resonance.locale),
            icon: resonance.message.author.avatarURL
          },
          attachments: [
            attachment,
            new DiscordJS.Attachment(`${this.talent.directory}/icon.png`, 'icon.png')
          ],
          image: `attachment://${character.filename}`,
          // thumbnail: `attachment://icon.png`

        }).catch(Lavenza.continue);
        break;
      }

      // If we're in Twitch...
      case Lavenza.ClientTypes.Twitch: {
        await resonance.__reply(`Your new main is...{{character}}`, {character: character.name});
        break;
      }
    }
  }

  /**
   * Crawls the assets directory and returns a random file from within a subdirectory.
   *
   * @param {string} directory
   *   Path to the directory containing the sub directories.
   */
  static getRandomCharacterPortraitFromDirectory(directory) {

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
    return {
      portrait: directory + '/' + subDirectoryName + '/' + file,
      filename: file,
      name: subDirectoryName
    };

  }

}