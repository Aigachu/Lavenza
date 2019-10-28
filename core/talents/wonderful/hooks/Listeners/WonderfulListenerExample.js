"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
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
const Listener_1 = require("../../../../lib/Lavenza/Bot/Listener/Listener");
/**
 * A wonderful listener!
 */
class WonderfulListenerExample extends Listener_1.Listener {
    /**
     * If we hear 'wonderful', we say Wonderful! <3.
     *
     * @param resonance
     *   The resonance heard by the listener.
     */
    static sayWonderfulToo(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we hear 'wonderful', we say Wonderful! <3.
            if (resonance.content === "wonderful") {
                yield resonance.__reply("Wonderful! <3");
            }
        });
    }
    /**
     * This is the function that listens to messages and acts upon them.
     *
     * @inheritDoc
     */
    listen(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Say wonderful!
            yield WonderfulListenerExample.sayWonderfulToo(resonance);
        });
    }
}
exports.WonderfulListenerExample = WonderfulListenerExample;
