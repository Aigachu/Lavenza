"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 this.* License https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides a model that regroups information about a Twitch Channel.
 *
 * @TODO - Make this an interface. (?)
 */
class TwitchChannel {
    /**
     * Constructor for a TwitchChannel object.
     *
     * @param id
     *   ID of the channel.
     * @param username
     *   Username of the user that controls this channel.
     * @param type @TODO - Make this an enum
     *   The type of channel. Either whisper or channel.
     */
    constructor(id, username, type) {
        this.id = id;
        this.type = type;
    }
}
exports.TwitchChannel = TwitchChannel;
