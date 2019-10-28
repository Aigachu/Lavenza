/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../Resonance/Resonance";

import { Command } from "./Command";

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
export abstract class CommandClientHandler {

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
  public abstract async execute(data: unknown): Promise<unknown>;

}
