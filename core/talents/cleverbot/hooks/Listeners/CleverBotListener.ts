/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";

// Imports.
import { ClientType } from "../../../../lib/Lavenza/Bot/Client/ClientType";
import { DiscordClient } from "../../../../lib/Lavenza/Bot/Client/Discord/DiscordClient";
import { Listener } from "../../../../lib/Lavenza/Bot/Listener/Listener";
import { Resonance } from "../../../../lib/Lavenza/Bot/Resonance/Resonance";
import { Morgana } from "../../../../lib/Lavenza/Confidant/Morgana";
import { CleverBot } from "../../CleverBot";

// Noinspection JSUnusedGlobalSymbols
/**
 * Custom Listener for the CleverBot Talent.
 *
 * It simply hears a message and has a small chance of querying the CleverBot API and answering!
 */
export class CleverBotListener extends Listener {

  /**
   * Declare the Talent.
   */
  protected talent: CleverBot;

  /**
   * This is the function that listens to messages and acts upon them.
   *
   * @inheritDoc
   */
  public async listen(resonance: Resonance): Promise<void> {
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
  public async saySomethingClever(resonance: Resonance): Promise<void> {
    // If the API isn't set, we don't do anything.
    if (this.talent.cleverBotApi) {
      try {
        if (resonance.client.type === ClientType.Discord) {
          const client = resonance.client as DiscordClient;
          await client.typeFor(5, resonance.message.channel as TextChannel | DMChannel | GroupDMChannel);
        }
        const response = await this.talent.cleverBotApi.query(resonance.content);
        let author = resonance.author.username;

        // If we're on discord, the author should be a tag.
        if (resonance.client.type === ClientType.Discord) {
          author = `<@${resonance.message.author.id}>`;
        }
        await resonance.__reply("{{author}}, {{response}}", {
          author,
          response: response.output,
        });
      } catch (e) {
        await Morgana.warn("Error occurred when querying CleverBot API. This is either due to special characters being in the message heard in the listener, or the API not being able to be instantiated.");
      }
    }
  }

}
