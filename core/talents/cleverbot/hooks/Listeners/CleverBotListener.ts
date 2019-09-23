/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Listener from "../../../../lib/Lavenza/Bot/Listener/Listener";
import Resonance from "../../../../lib/Lavenza/Bot/Resonance/Resonance";
import Morgana from "../../../../lib/Lavenza/Confidant/Morgana";
import ClientType from "../../../../lib/Lavenza/Bot/Client/ClientType";
import CleverBot from "../../CleverBot";
import DiscordClient from "../../../../lib/Lavenza/Bot/Client/DiscordClient/DiscordClient";

// noinspection JSUnusedGlobalSymbols
/**
 * Custom Listener for the CleverBot Talent.
 *
 * It simply hears a message and has a small chance of querying the CleverBot API and answering!
 */
export default class CleverBotListener extends Listener {

  /**
   * Declare the Talent.
   */
  protected talent: CleverBot;

  /**
   * This is the function that listens to messages and acts upon them.
   *
   * @inheritDoc
   */
  async listen(resonance: Resonance) {
    // Say something clever! A 1% chance to do so.
    // We only bought 15K API calls for now...We don't want this to happen too often.
    // 2% chance of saying something clever.
    if (Math.random() < 0.02) {
      await this.saySomethingClever(resonance);
    }
  }

  /**
   * Say something clever using CleverBot's API.
   *
   * @param resonance
   *   The resonance heard by the listener.
   */
  async saySomethingClever(resonance: Resonance) {
    // If the API isn't set, we don't do anything.
    if (this.talent.cleverBotApi) {
      try {
        if (resonance.client.type === ClientType.Discord) {
          let client = resonance.client as DiscordClient;
          await client.typeFor(5, resonance.message.channel);
        }
        let response = await this.talent.cleverBotApi.query(resonance.content);
        let author = '';

        // If we're on discord, the author should be a tag. Otherwise, we just get the username.
        if (resonance.client.type === ClientType.Discord) {
          author = `<@${resonance.message.author.id}>`;
        } else {
          author = resonance.author.username;
        }

        await resonance.__reply(`{{author}}, {{response}}`, {
          author: author,
          response: response['output'],
        });
      } catch(e) {
        await Morgana.warn(`Error occurred when querying CleverBot API. This is either due to special characters being in the message heard in the listener, or the API not being able to be instantiated.`);
      }
    }
  }

}