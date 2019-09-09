/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import DiscordResonance from './DiscordResonance';
import TwitchResonance from './TwitchResonance';
import ClientType from '../Client/ClientType';
import Sojiro from '../../Confidant/Sojiro';
import Igor from '../../Confidant/Igor';
import Bot from "../Bot";
import ClientInterface from "../Client/ClientInterface";
import Resonance from "./Resonance";

/**
 * Provides a factory to create the appropriate CommandAuthorizer given a client.
 *
 * Each client validates clients in different ways.
 */
export default class ResonanceFactory {

  /**
   * Resonance builder defined by the factory.
   *
   * @param content
   *   The raw string content of the message heard by the bot.
   * @param message
   *   The message object received, unmodified. This is useful, since different clients might send different kinds of
   *   message objects. It's always nice to have the original message.
   * @param bot
   *   The bot that heard this message.
   * @param client
   *   The client that sent the original message.
   */
  static async build(content: string, message: any, bot: Bot, client: ClientInterface): Promise<Resonance> {
    // Initialize the resonance variable.
    let resonance = null;

    //  Depending on the client type, build the appropriate CommandAuthorizer.
    switch (client.type) {
      // For Discord, we create a specific resonance.
      case ClientType.Discord: {
        resonance = new DiscordResonance(content, message, bot, client);
        break;
      }

      // For Twitch, we create a specific resonance.
      case ClientType.Twitch: {
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
    if (Sojiro.isEmpty(resonance)) {
      await Igor.throw('Resonance could not be built. This should not happen. Fix your shitty code, Aiga!');
    }

    // Run Resonance async build.
    await resonance.build();

    // Build the resonance. Then we're good to go. We can send it back to the bot.
    return resonance;
  }

}