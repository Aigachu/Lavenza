/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Models.
import Listener from '../Listener/Listener';
import CommandInterpreter from './CommandInterpreter';

export default class CommandListener extends Listener {
  static listen(content, message, bot, client) {
    let commandInfo = CommandInterpreter.interpret(content, message, bot, client);
    if (commandInfo) {
      commandInfo.command.execute(content, message, bot, client)
    }
  }
}