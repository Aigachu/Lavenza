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
/**
 * Right now she is quite literally a copy paste of the good old legendary MaidenCooldownManager.
 *
 * NEEDS A REVAMP. @TODO
 */
class Makoto {
    /**
     * Constructor for the CooldownManager class.
     * Takes the client of the bot as an argument.
     */
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Instantiate the cooldowns object.
            Makoto.cooldowns = {}; // @TODO - Save cooldowns in a database file.
        });
    }
    /**
     * Set a cooldown for a given command, scope and duration.
     */
    static set(bot, type, key, scope, duration) {
        if (!(bot in Makoto.cooldowns)) {
            Makoto.cooldowns[bot] = {};
        }
        // Set object for this cooldown type if it doesn't exist.
        if (!(type in Makoto.cooldowns[bot])) {
            Makoto.cooldowns[bot][type] = {};
        }
        // Initialize array for this cooldown key if it doesn't exist.
        if (!(key in Makoto.cooldowns[bot][type])) {
            Makoto.cooldowns[bot][type][key] = [];
        }
        // Set the cooldown into the array.
        Makoto.cooldowns[bot][type][key].push(scope);
        // Start the countdown for the duration.
        // Note: Not sure why I use a promise here. I think I wanted to be cool. ¯\_(ツ)_/¯
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Makoto.unset(bot, type, key, scope);
                resolve(); // Yay! Everything went well!
                reject(); // Ugh...
            }, duration);
        });
    }
    /**
     * Unset a cooldown for a given command, user and scope.
     */
    static unset(bot, type, key, scope) {
        // Remove the cooldown.
        Makoto.cooldowns[bot][type][key].splice(Makoto.cooldowns[bot][type][key].indexOf(scope), 1);
    }
    /**
     * Check if a cooldown exists with the given parameters.
     */
    static check(bot, type, key, scope) {
        if (!(bot in Makoto.cooldowns)) {
            return false;
        }
        // If the type isn't set, then the cooldown surely isn't set.
        // For example, if a command is called,
        // But the 'cooldown' type isn't found, then there are no cooldowns for commands at all.
        if (!(type in Makoto.cooldowns[bot])) {
            return false;
        }
        // If the key isn't set, then the cooldown surely isn't set.
        // For example, if for the ping command,
        // The key 'ping' isn't found, then there are no cooldowns for the ping command.
        if (!(key in Makoto.cooldowns[bot][type])) {
            return false;
        }
        // Returns whether or not the cooldown exists.
        return Makoto.cooldowns[bot][type][key].indexOf(scope) > -1;
    }
}
exports.Makoto = Makoto;
