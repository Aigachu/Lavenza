"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Expose an Enum to manage the core roles in Lavenza.
 * @TODO - Eventual permissions management? :)
 */
var Eminence;
(function (Eminence) {
    // noinspection JSUnusedGlobalSymbols
    Eminence[Eminence["None"] = 0] = "None";
    Eminence[Eminence["Aficionado"] = 1] = "Aficionado";
    Eminence[Eminence["Confidant"] = 2] = "Confidant";
    Eminence[Eminence["Thief"] = 3] = "Thief";
    Eminence[Eminence["Joker"] = 4] = "Joker";
})(Eminence || (Eminence = {}));
exports.default = Eminence;
