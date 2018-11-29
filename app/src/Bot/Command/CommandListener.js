/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Models.
import Listener from '../Listener/Listener';
import CommandInterpreter from './CommandInterpreter';

/**
 * Provides a class for the CommandListener.
 *
 * The CommandListener will handle the determination of whether a received Resonance is a command.
 *
 * All the logic for commands starts here.
 */
export default class CommandListener extends Listener {

  /**
   * @inheritDoc
   */
  static listen(resonance) {

    // Use the CommandInterpreter to find out if there's a command in the resonance.
    // If there's a command, the interpreter will return an order.
    let order = CommandInterpreter.interpret(resonance);

    // If there is no order, we do nothing after all.
    if (!order) {
      return;
    }

    // If an order was found, execute it.
    order.execute();
  }
}