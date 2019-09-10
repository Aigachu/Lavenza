/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Command from "./Command";
import Resonance from "../Resonance/Resonance";
import Sojiro from "../../Confidant/Sojiro";
import Kawakami from "../../Confidant/Kawakami";

/**
 * A simple client handler.
 *
 * Client Handlers are mostly used when Commands need to do different tasks depending on the client where they were
 * invoked. Using Client Handlers makes it easy to decouple the code properly.
 *
 * A great example of this can be found in the examples command. It'll be easier to understand in practice!
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default abstract class CommandClientHandler {

  /**
   * Command that this handler is tied to.
   */
  public command: Command;

  /**
   * Resonance that triggered the command.
   */
  public resonance: Resonance;

  /**
   * Path to the directory where this handler is located.
   */
  public directory: string;

  /**
   * ClientHandler constructor.
   *
   * Provides a constructor for ClientHandlers, classes that handle tasks for Commands that are specific to a client.
   *
   * @param command
   *   Command this handler belongs to.
   * @param resonance
   *   Resonance that triggered the command.
   * @param directory
   *   Path to this Handler's directory.
   */
  protected constructor(command: Command, resonance: Resonance, directory: string) {
    this.command = command;
    this.resonance = resonance;
    this.directory = directory;
  }

  /**
   * Execute this handler's tasks.
   *
   * Each defined handler needs to have it's own execute() function defined by whoever is coding the handler.
   *
   * @param data
   *   Data passed to the ClientHandlers executor.
   *
   * @returns
   *   Can returns any form of data depending on the type of function that was called.
   */
  abstract async execute(data: any): Promise<any>;

  // noinspection JSUnusedGlobalSymbols
  /**
   * Send a basic reply.
   *
   * A wrapper function that can send a quick reply to a message.
   *
   * @param data
   *   The data containing information on the message to send.
   *
   * @returns
   *   The message that was sent as a reply.
   */
  async basicReply(data: any): Promise<any> {
    data.replacers = data.replacers || {};

    // Set up for "bolding" any replacers.
    if (!Sojiro.isEmpty(data.bolds)) {
      await Promise.all(data.bolds.map(async (key) => {
        if (!data.replacers[key]) {
          return;
        }
        data.replacers[key] = await Kawakami.bold(data.replacers[key]);
      }));
    }
    await this.resonance.typeFor(1, this.resonance.channel);
    await this.resonance.__reply(data.message, Object.assign({user: this.resonance.author}, data.replacers));
  }

}