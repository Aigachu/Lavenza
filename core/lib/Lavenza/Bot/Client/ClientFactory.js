"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Gestalt_1 = require("../../Gestalt/Gestalt");
const ClientType_1 = require("./ClientType");
const DiscordClient_1 = require("./Discord/DiscordClient");
const TwitchClient_1 = require("./Twitch/TwitchClient");
/**
 * Provide a factory class that manages the creation of the right client given a type.
 */
class ClientFactory {
    /**
     * Creates a client instance given a type, bot and configuration.
     *
     * A client is created for each Bot.
     *
     * Each type of client has a different class. We will properly decouple and manage the functionality of each type of
     * client.
     *
     * @param type
     *   Type of client to build.
     * @param config
     *   Configuration object to create the client with, fetched from the bot's configuration file.
     * @param bot
     *   Bot that this client will be linked to.
     *
     * @returns
     *   Client that was instantiated.
     */
    static build(type, config, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the object.
            let client;
            // Depending on the requested type, we build the appropriate client.
            switch (type) {
                // Create a DiscordClient if the type is Discord.
                case ClientType_1.ClientType.Discord: {
                    client = new DiscordClient_1.DiscordClient(bot, config);
                    break;
                }
                // Create a TwitchClient if the type is Discord.
                case ClientType_1.ClientType.Twitch: {
                    client = new TwitchClient_1.TwitchClient(bot, config);
                }
                // // Create a SlackClient if the type is Discord.
                // Case ClientType.Slack: {
                //   Client = new SlackClient(config, bot);
                //   Break;
                // }
            }
            // Bridge a connection to the application for the client.
            yield client.bridge();
            // Run build tasks for client.
            yield client.build();
            // Make sure database collection exists for this client for the given bot.
            yield Gestalt_1.Gestalt.createCollection(`/bots/${bot.id}/clients/${client.type}`);
            // Make sure database collection exists for permissions in this client.
            yield Gestalt_1.Gestalt.createCollection(`/bots/${bot.id}/clients/${client.type}`);
            // Initialize i18n database collection for this client if it doesn't already exist.
            yield Gestalt_1.Gestalt.createCollection(`/i18n/${bot.id}/clients/${client.type}`);
            // Return the client.
            return client;
        });
    }
}
exports.ClientFactory = ClientFactory;
