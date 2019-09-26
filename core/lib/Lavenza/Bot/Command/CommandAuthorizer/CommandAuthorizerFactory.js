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
// Imports.
const DiscordCommandAuthorizer_1 = require("./DiscordCommandAuthorizer");
const TwitchCommandAuthorizer_1 = require("./TwitchCommandAuthorizer");
const ClientType_1 = require("../../Client/ClientType");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Igor_1 = require("../../../Confidant/Igor");
/**
 * Provides a factory to create the appropriate CommandAuthorizer given a client.
 *
 * Each client validates clients in different ways.
 */
class CommandAuthorizerFactory {
    /**
     * Build the appropriate authorizer given the client.
     *
     * @param resonance
     *   The Resonance returned from the Listener, containing the command.
     * @param command
     *   The Command that was located in the Resonance.
     *
     * @returns
     *   The appropriate CommandAuthorizer given the received message & command.
     */
    static build(resonance, command) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the variable.
            let authorizer = null;
            //  Depending on the client type, build the appropriate CommandAuthorizer.
            switch (resonance.client.type) {
                // For Discord, we create a specific authorizer.
                case ClientType_1.ClientType.Discord: {
                    authorizer = new DiscordCommandAuthorizer_1.DiscordCommandAuthorizer(resonance, command);
                    break;
                }
                case ClientType_1.ClientType.Twitch: {
                    authorizer = new TwitchCommandAuthorizer_1.TwitchCommandAuthorizer(resonance, command);
                    break;
                }
                // case ClientTypes.Slack:
                //   client = new SlackClient(config);
                //   break;
            }
            // This really shouldn't happen...But yeah...
            if (Sojiro_1.Sojiro.isEmpty(authorizer)) {
                yield Igor_1.Igor.throw('Command authorizer could not be built. This should not happen. Fix your shitty code, Aiga!');
            }
            // Build the authorizer. Then we're good to go. We can send it back to the listener.
            yield authorizer.build(resonance);
            return authorizer;
        });
    }
}
exports.CommandAuthorizerFactory = CommandAuthorizerFactory;
