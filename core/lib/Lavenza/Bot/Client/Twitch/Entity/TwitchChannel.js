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
class TwitchChannel {
    /**
     * Provides a constructor for TwitchMessages.
     */
    constructor(id, user, type) {
        this.id = id;
        this.user = user;
        this.type = type;
    }
}
exports.TwitchChannel = TwitchChannel;
