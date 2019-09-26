/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Listener} from '../../Listener/Listener';
import {CommandInterpreter} from '../CommandInterpreter/CommandInterpreter';
import {CommandAuthorizerFactory} from "../CommandAuthorizer/CommandAuthorizerFactory";
import {Resonance} from "../../Resonance/Resonance";

/**
 * Provides a Listener that listens for commands when messages are heard by a Bot.
 *
 * The CommandListener will handle the determination of whether a received Resonance contains a command or not.
 *
 * All the logic for commands starts here.
 */
export class CommandListener extends Listener {

  /**
   * @inheritDoc
   */
  public async listen(resonance: Resonance) {
    // Use the CommandInterpreter to find out if there's a command in the resonance.
    // If there's a command, the interpreter will return an instruction that will be assigned to the Resonance we heard.
    await CommandInterpreter.interpret(resonance);

    // If there is no instruction, we do nothing after all.
    if (!resonance.instruction) {
      return;
    }

    // If the help option is used, we fire the help function of the command and return.
    let args = await resonance.getArguments();
    if (args['_'].includes('help') || 'help' in args) {
      resonance.executeHelp().then(() => {
        // Do nothing.
      });
      return;
    }

    // Now that we know a command has been found, we need to pass it through the right Authorizer.
    // We use a factory to build an appropriate authorizer.
    let authorizer = await CommandAuthorizerFactory.build(resonance, await resonance.getCommand());

    // The CommandAuthorizer checks if the command is authorized in the current context.
    // If for any reason it's unauthorized, we don't do anything with the command.
    let authorized = await authorizer.authorize();
    if (!authorized) {
      return;
    }

    // If an order was found, execute it.
    resonance.executeCommand().then(() => {
      // Do nothing.
    });

    // And at the same time we set the cooldown for the command.
    await authorizer.activateCooldownForCommand();
  }

}