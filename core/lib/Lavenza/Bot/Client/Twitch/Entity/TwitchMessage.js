"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides a class for Twitch Messages.
 */
class TwitchMessage {
    /**
     * Provides a constructor for TwitchMessages.
     */
    constructor(content, author, channel, context) {
        this.content = content;
        this.author = author;
        this.channel = channel;
        this.context = context;
    }
}
exports.TwitchMessage = TwitchMessage;
