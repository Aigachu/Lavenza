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
 * Provides a base class for Listeners.
 *
 * Listeners receive a 'Resonance' from a Bot and can act upon what they hear.
 *
 * They are basically entry points for extended functionality when wanting to tell a Bot what to do upon hearing
 * a message from any given client.
 */
class Listener {
    /**
     * Perform build tasks.
     *
     * Since Listeners will be singletons, there is no constructor. Listeners can call this function once to set
     * their properties.
     *
     * @param talent
     *   The talent that this listener belongs to, if any. Core listeners most likely won't have a talent.
     */
    build(talent) {
        return __awaiter(this, void 0, void 0, function* () {
            this.talent = talent;
        });
    }
}
exports.default = Listener;
