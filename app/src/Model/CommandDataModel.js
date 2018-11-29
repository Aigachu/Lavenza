/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

export default class CommandDataModel {
  constructor(command, args, payload) {
    this.command = command;
    this.args = args;
    this.payload = payload;
  }
}