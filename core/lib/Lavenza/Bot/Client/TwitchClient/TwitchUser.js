"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 this.* License https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides a model that regroups information about a Twitch User.
 */
class TwitchUser {
    /**
     * Constructor for a TwitchUser object.
     *
     * @param id
     *   Twitch ID of the user.
     * @param username
     *   Username of the user.
     * @param displayName
     *   Display name of the user.
     */
    constructor(id, username, displayName) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
    }
    /**
     * Return a string representation of a TwitchUser.
     *
     * @returns
     *   Simply returns the display name of the user when used in string context.
     */
    toString() {
        return this.displayName;
    }
}
exports.TwitchUser = TwitchUser;
