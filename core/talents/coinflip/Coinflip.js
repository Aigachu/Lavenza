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
const Talent_1 = require("../../lib/Lavenza/Talent/Talent");
/**
 * Coinflip Talent.
 *
 * This talent grants the coinflip command and has many additional features included in it!
 */
class Coinflip extends Talent_1.Talent {
    /**
     * @inheritDoc
     */
    build(config) {
        const _super = Object.create(null, {
            build: { get: () => super.build }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Run default builder.
            yield _super.build.call(this, config);
        });
    }
    /**
     * @inheritDoc
     */
    initialize(bot) {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Run default initializer.
            yield _super.initialize.call(this, bot);
        });
    }
}
exports.default = Coinflip;
