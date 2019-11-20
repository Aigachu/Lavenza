/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../lib/Lavenza/Resonance/Resonance";
import { Talent } from "../../lib/Lavenza/Talent/Talent";

import { ClientUtilityFactory } from "./src/Command/Client/ClientUtilityFactory";
import { CommandCooldownManager } from "./src/Command/CommandCooldownManager/CommandCooldownManager";

/**
 * Core Talent to allow management of commands in a Bot.
 */
export class Commander extends Talent {

  /**
   * Resonator function for the Commander talent.
   *
   * This will attempt to search for a command in a message and do that command if necessary.
   *
   * @inheritDoc
   */
  public async resonate(resonance: Resonance): Promise<void> {
    // Use the CommandInterpreter to find out if there's a command in the resonance.
    // If there's a command, the interpreter will return an instruction that will be assigned to the Resonance we heard.
    const interpreter = await ClientUtilityFactory.buildCommandInterpreter(resonance);
    const instruction = await interpreter.interpret(resonance);

    // If there is no instruction, we do nothing after all.
    if (!instruction) {
      return;
    }

    // If the help option is used, we fire the help function of the command and return.
    if (instruction.arguments._.includes("help") || "help" in instruction.arguments) {
      // We don't use await here, or this would probably halt the whole program while the command executes.
      instruction.command.help(instruction)
        .then(() => {
          // Do nothing.
        });

      return;
    }

    // Now that we know a command has been found, we need to pass it through the right Authorizer.
    // We use a factory to build an appropriate authorizer.
    const authorizer = await ClientUtilityFactory.buildCommandAuthorizer(instruction);
    const authorized = await authorizer.authorize();
    if (!authorized) {
      return;
    }

    // If a command was found and authorized, execute it.
    // We don't use await here, or this would probably halt the whole program while the command executes.
    instruction.command.execute(instruction, resonance)
      .then(async () => {
        // Activate cooldown for this command.
        // @TODO - We MAY need to take this out of the above then() and set it to execute synchronously. We'll see.
        CommandCooldownManager.setCooldown(instruction)
          .then(async () => {
            // Do nothing for now!
          });
      });
  }

}
