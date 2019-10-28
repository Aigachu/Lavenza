"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A little Enum to manage our types of Clients.
 *
 * We don't wanna have to change them EVERYWHERE. So we manage them all here!
 */
var ClientType;
(function (ClientType) {
    ClientType["Discord"] = "discord";
    ClientType["Twitch"] = "twitch";
    // Slack = 'slack'
    // Youtube = 'youtube',
    // Skype = 'a funny joke',
    // Whatsapp = 'oh really?',
    // Messenger = 'LOL! This one will be fun...',
    // WeChat = 'CHINESE TRANSLATIONS?!',
})(ClientType || (ClientType = {}));
exports.ClientType = ClientType;
