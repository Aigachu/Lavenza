/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import DiscordResonance from './DiscordResonance';
import TwitchResonance from './TwitchResonance';

/**
 * Provides a factory to create the appropriate CommandAuthorizer given a client.
 *
 * Each client validates clients in different ways.
 */
export default class ResonanceFactory {

  /**
   * Resonance builder defined by the factory.
   *
   * @param {string} content
   *   The raw string content of the message heard by the bot.
   * @param {Message} message
   *   The message object received, unmodified. This is useful, since different clients might send different kinds of
   *   message objects. It's always nice to have the original message.
   * @param {Bot} bot
   *   The bot that heard this message.
   * @param {*} client
   *   The client that sent the original message.
   */
  static async build(content, message, bot, client) {

    // Initialize the resonance variable.
    let resonance = null;

    //  Depending on the client type, build the appropriate CommandAuthorizer.
    switch (client.type) {

      // For Discord, we create a specific resonance.
      case Lavenza.ClientTypes.Discord: {
        resonance = new DiscordResonance(content, message, bot, client);
        break;
      }

      // For Twitch, we create a specific resonance.
      case Lavenza.ClientTypes.Twitch: {
        resonance = new TwitchResonance(content, message, bot, client);
        break;
      }

      // For Slack, we create a specific resonance.
      // case ClientTypes.Slack: {
      //   resonance = new SlackResonance(content, message, bot, client);
      //   break;
      // }

    }

    // This really shouldn't happen...But yeah...
    if (Lavenza.isEmpty(resonance)) {
      await Lavenza.throw('Resonance could not be built. This should not happen. Fix your shitty code, Aiga!');
    }

    // Run Resonance async build.
    await resonance.build();

    // Build the resonance. Then we're good to go. We can send it back to the bot.
    return resonance;

  }

  /**
   * Sender wrapper that is managed in the Factory.
   *
   * Since circular imports are broken in ES6, we need the factory to handle invoking the child Resonance doSend()
   * methods. We manage all this here.
   *
   * @param {string} clientType
   *   Type of client we're sending a message with.
   * @param {Bot} bot
   *   The bot sending the message.
   * @param {*} destination
   *   The destination of the message.
   * @param {string} content
   *   The text content of the message.
   *
   * @returns {Promise<*>}
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  static async send(clientType, bot, destination, content) {

    // Depending on the client, we call the appropriate sender.
    switch (clientType) {

      // Discord.
      case Lavenza.ClientTypes.Discord: {
        return await DiscordResonance.doSend(bot, destination, content);
      }

      // Twitch.
      case Lavenza.ClientTypes.Twitch: {
        return await TwitchResonance.doSend(bot, destination, content);
      }
    }
  }



}