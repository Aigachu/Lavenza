"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides a class for Twitch Messages.
 */
class TwitchUser {
    /**
     * Provides a constructor for TwitchMessages.
     */
    constructor(id, username, displayName) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
    }
    /**
     * Provide a custom toString method.
     *
     * Useful for when this class is used in template strings.
     */
    toString() {
        return this.username;
    }
}
exports.TwitchUser = TwitchUser;
