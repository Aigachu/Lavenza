/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { Listener } from "../../../listeners/src/Listener/Listener";
import { CommandCooldownManager } from "../../src/Command/CommandCooldownManager/CommandCooldownManager";
import { CommandInterpreter } from "../../src/Command/CommandInterpreter/CommandInterpreter";

/**
 * Provides a Listener that listens for commands when messages are heard by a Bot.
 *
 * The CommandListener will handle the determination of whether a received Resonance contains a command or not.
 *
 * All the logic for commands starts here.
 */
export class CommandListener extends Listener {

  /**
   * Listen to a resonance and act upon it.
   *
   * @inheritDoc
   */
  public async listen(resonance: Resonance): Promise<void> {
    // Use the CommandInterpreter to find out if there's a command in the resonance.
    // If there's a command, the interpreter will return an instruction that will be assigned to the Resonance we heard.
    const instruction = await CommandInterpreter.interpret(resonance);

    // If there is no instruction, we do nothing after all.
    if (!instruction) {
      return;
    }

    // If the help option is used, we fire the help function of the command and return.
    const args = await resonance.getArguments();
    if (args._.includes("help") || "help" in args) {
      // We don't use await here, or this would probably halt the whole program while the command executes.
      resonance.executeHelp()
        .then(() => {
          // Do nothing.
        });

      return;
    }

    // Now that we know a command has been found, we need to pass it through the right Authorizer.
    // We use a factory to build an appropriate authorizer.
    const authorized = await resonance.client.authorize(await resonance.getCommand(), resonance);
    if (!authorized) {
      return;
    }

    // If a command was found and authorized, execute it.
    // We don't use await here, or this would probably halt the whole program while the command executes.
    resonance.executeCommand()
      .then(async () => {
        // Activate cooldown for this command.
        // @TODO - We MAY need to take this out of the above then() and set it to execute synchronously. We'll see.
        CommandCooldownManager.setCooldown(resonance)
          .then(async () => {
            // Do nothing for now!
          });
      });
  }

}
