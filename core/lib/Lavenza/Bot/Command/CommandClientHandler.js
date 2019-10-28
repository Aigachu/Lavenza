"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
class CommandClientHandler {
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
    constructor(command, resonance, directory) {
        this.command = command;
        this.resonance = resonance;
        this.directory = directory;
    }
}
exports.CommandClientHandler = CommandClientHandler;
