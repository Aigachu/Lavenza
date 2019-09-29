"use strict";
/**
 * Project Lavenza-II
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
// Modules.
const translate_1 = require("@google-cloud/translate");
const arp = require("app-root-path");
const fs = require("fs");
const i18n = require("i18n");
const Core_1 = require("../Core/Core");
const Akechi_1 = require("./Akechi");
const Igor_1 = require("./Igor");
const Sojiro_1 = require("./Sojiro");
/**
 * Provides a class that handles Dictionary and Database management, as well as translation.
 *
 * Another name for this could be the TextManager.
 *
 * Yoshida handles speech, and the importance of expressing oneself properly. So this class as such will handle
 * personalization of texts. It will also handle translations.
 */
class Yoshida {
    /**
     * Initialize values needed to use I18N efficiently.
     */
    static initializeI18N() {
        return __awaiter(this, void 0, void 0, function* () {
            // Configure i18n real quick.
            i18n.configure({
                autoReload: true,
                defaultLocale: process.env.LAVENZA_DEFAULT_LOCALE,
                directory: `${Core_1.Core.paths.root}/lang`,
            });
            // Initialize variable that will house translate client.
            let googleTranslate;
            // If a project ID is set, we can set up translate.
            if (process.env.LAVENZA_GOOGLE_TRANSLATE_PROJECT_ID) {
                // Your Google Cloud Platform project ID is fetched from the .env file.
                const googleTranslateProjectId = process.env.LAVENZA_GOOGLE_TRANSLATE_PROJECT_ID;
                // Instantiates a translation client.
                const googleTranslateConfig = {};
                googleTranslateConfig.projectId = googleTranslateProjectId;
                googleTranslate = new translate_1.Translate(googleTranslateConfig);
            }
            Yoshida.googleTranslate = googleTranslate;
            Yoshida.translationInitialized = true;
        });
    }
    /**
     * Parse parameters passed to a function that takes an i18n format.
     *
     * Functions that involve sending text to places usually take on similar formats and must parse their parameters
     * in a specific way. These functions should be flexible enough to allow for many different ways to use them.
     *
     * @param parameters
     *   Parameters to parse from the i18n __ call. Parameters can be passed to __ in different ways.
     *   The idea is that whatever is passed her needs to properly be sent to the __ function in the i18n module. You can
     *   either send only text, send texts with replacements, send text with replacements and a specific locale or send
     *   text without replacements but with a specific locale.
     *
     *   Let's be real, I just want to avoid passing 'undefined' as a parameter, and I also want to avoid having to
     *   deconstruct my parameters into objects every time I translate a string.
     *
     *   Examples below.
     *   i.e. __({phrase: "Hello {{name}}", locale: "en"}, {name: 'Kyle'}
     *   i.e. __("Hello {{name}}", {name: 'Kyle'}, 'en')
     *   i.e. __("Hello", 'en')
     *   i.e. __("Hello")
     *
     * @return
     *   Object containing all information necessary to translate a string.
     */
    static parseI18NParams(parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // If for some reason we receive parameters that are already parsed, simply return them.
            // @TODO - Not sure how to feel about this one. We'll most likely refactor this in the future.
            if ("PARSED" in parameters) {
                return parameters;
            }
            // Declare our variable to be returned.
            const parsed = {
                locale: undefined,
                phrase: undefined,
                replacers: undefined,
                tag: undefined,
            };
            // If no parameters are passed, we can't really do much.
            if (parameters === undefined) {
                return undefined;
            }
            // If it's called with an object as the parameter.
            // I.e. __({phrase: "Hello {{name}}", locale: "en", tag: "PING_RESPONSE"}, {name: 'Kyle'}
            if (typeof parameters[0] === "object") {
                // Store it in a variable to process.
                const i18nParamsObject = parameters[0];
                // Parse parameters.
                parsed.phrase = i18nParamsObject.phrase;
                parsed.locale = i18nParamsObject.locale;
                parsed.replacers = parameters[1] || undefined;
                parsed.tag = i18nParamsObject.tag;
                return parsed;
            }
            // If it's called with a string as the parameter.
            // I.e. __("Hello {{name}}", {name: 'Kyle'}, 'en', 'PING_RESPONSE')
            // I.e. __("Hello", 'en', 'PING_RESPONSE')
            if (typeof parameters[0] === "string") {
                // Parse parameters.
                parsed.phrase = parameters[0];
                // If a second parameter is set and is not undefined.
                if (parameters[1] !== undefined) {
                    // If the second parameter is a string, we're expecting to get the locale directly.
                    // I.e. __("Hello", 'en')
                    // I.e. __("Hello", 'en', 'PING_RESPONSE')
                    if (typeof parameters[1] === "string") {
                        // Tags always start with '::'. So if this parameter doesn't start with that, we know a locale is being set.
                        if (!parameters[1].startsWith("::")) {
                            parsed.locale = parameters[1];
                            parsed.tag = parameters[2] || undefined;
                        }
                        else {
                            parsed.locale = undefined;
                            parsed.tag = parameters[1];
                        }
                    }
                    else {
                        parsed.replacers = parameters[1];
                        if (parameters[2] !== undefined) {
                            if (typeof parameters[2] === "string") {
                                // Tags always start with '::'.
                                // So if this parameter doesn't start with that, we know a locale is being set.
                                if (!parameters[2].startsWith("::")) {
                                    parsed.locale = parameters[2];
                                    parsed.tag = parameters[3] || undefined;
                                }
                                else {
                                    parsed.locale = undefined;
                                    parsed.tag = parameters[2];
                                }
                            }
                        }
                        else {
                            parsed.locale = parameters[2] || "en";
                            parsed.tag = parameters[3] || undefined;
                        }
                    }
                }
                else {
                    // If a locale is set but replacers are set to null,
                    if (parameters[2] !== undefined) {
                        parsed.locale = parameters[2];
                        parsed.tag = parameters[3] || undefined;
                    }
                }
                return parsed;
            }
            // Technically we shouldn't reach here.
            return undefined;
        });
    }
    /**
     * Get a personalization for a given text from a bot's configurations.
     *
     * @param defaultText
     *   Default text that should be returned if personalizations don't exist.
     * @param tag
     *   Tag, or key, of the personalization in the configurations.
     * @param bot
     *   The Bot we should fetch personalizations for.
     *
     * @returns
     *   The personalized string for the bot fetched in configurations.
     */
    static personalize(defaultText, tag, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            return Yoshida.getPersonalization(defaultText, tag, bot);
        });
    }
    /**
     * Function to translate a string, that makes use of i18n's translation function (__).
     *
     * @param parameters
     *   Parameters to parse from the i18n __ call. Parameters can be passed to __ in different ways.
     *   The idea is that whatever is passed her needs to properly be sent to the __ function in the i18n module. You can
     *   either send only text, send texts with replacements, send text with replacements and a specific locale or send
     *   text without replacements but with a specific locale.
     *
     *   Let's be real, I just want to avoid passing 'undefined' as a parameter, and I also want to avoid having to
     *   deconstruct my parameters into objects every time I translate a string.
     *
     *   Examples below.
     *   i.e. __({phrase: "Hello {{name}}", locale: "en"}, {name: 'Kyle'}
     *   i.e. __("Hello {{name}}", {name: 'Kyle'}, 'en')
     *   i.e. __("Hello", 'en')
     *   i.e. __("Hello")
     *
     * @returns
     *   Translated text given the many parameters provided.
     */
    static translate(...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get our parameters using Sojiro's help.
            const params = yield Yoshida.parseI18NParams(parameters);
            // If translation isn't initialized, we simply return the regular text.
            if (!Yoshida.translationInitialized) {
                return params.phrase;
            }
            // If the locale is undefined, we simply use the default one.
            params.locale = params.locale ? params.locale : process.env.LAVENZA_DEFAULT_LOCALE;
            // Get the translations from i18n.
            const englishTranslation = i18n.__({ phrase: params.phrase, locale: "en" }, params.replacers);
            let translation = i18n.__({ phrase: params.phrase, locale: params.locale }, params.replacers);
            // If the text is untranslated, we'll fallback to google translate if it's enabled.
            if (process.env.LAVENZA_GOOGLE_TRANSLATE_STATUS === "enabled"
                && Yoshida.googleTranslate
                && params.locale !== "en"
                && englishTranslation === translation) {
                // Google Translate doesn't have parsing for replacers.
                // We want to add a unique identifier to the beginning of each replacer key to prevent translation.
                params.phrase = yield params.phrase.replace(/{{/g, "{{RPL.");
                [translation] = yield Yoshida.googleTranslate.translate(params.phrase, params.locale);
                // Now we can set everything back to normal before they're stored and sent.
                params.phrase = yield params.phrase.replace(/{{RPL\./g, "{{");
                translation = yield translation.replace(/{{RPL\./g, "{{");
                // Now the genius part...
                // We'll save Google's translation to our translation file, so we can re-use it later.
                // This will avoid us constantly translating the same string over and over.
                // We'll save it right into our i18n instance.
                const storage = require(`${arp.path}/lang/${params.locale}.json`);
                storage[params.phrase] = translation;
                yield fs.writeFile(`${arp.path}/lang/${params.locale}.json`, JSON.stringify(storage, undefined, 2), (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
                // If we have replacers to set, we set them manually just for this time.
                if (params.replacers !== undefined) {
                    yield Promise.all(Object.keys(params.replacers)
                        .map((replacer) => __awaiter(this, void 0, void 0, function* () {
                        translation = translation.replace(`{{${replacer}}}`, params.replacers[replacer]);
                    })));
                }
            }
            // If the translation is undefined for whatever reason, we simply return the regular phrase.
            // We may need to make our own Replacers logic in the future, since we're currently relying on i18n's function.
            if (!translation) {
                return params.phrase;
            }
            // Hotfix...
            // FUCKING SPECIAL CHARACTERS MAN.
            translation = yield translation.replace(/&lt;/g, "<");
            translation = yield translation.replace(/&gt;/g, ">");
            translation = yield translation.replace(/&amp;/g, "&");
            translation = yield translation.replace(/&quot;/g, '"');
            translation = yield translation.replace(/&#39;/g, "'");
            translation = yield translation.replace(/&#x60;/g, "`");
            return translation;
        });
    }
    /**
     * Get a personalization for a given text from a bot's configurations.
     *
     * @param defaultText
     *   Default text that should be returned if personalizations don't exist.
     * @param tag
     *   Tag, or key, of the personalization in the configurations.
     * @param bot
     *   The Bot we should fetch personalizations for.
     *
     * @returns
     *   The personalized string for the bot fetched in configurations.
     */
    static getPersonalization(defaultText, tag, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize variable to store personalizations.
            let personalizations = {};
            // Check if the tag formatting is permitted.
            // We hard crash if this isn't the case. Tags should always be defined with "::" as the first characters.
            if (!tag.startsWith("::")) {
                yield Igor_1.Igor.throw(`Invalid format for tag '{{tag}}'. All tags should start with "::". Please change your tag in the code.`, { tag });
            }
            // Determine path to personalizations file.
            const pathToPersonalizations = `${bot.directory}/personalizations.yml`;
            // If personalizations don't exist, simply return the default text.
            if (!Akechi_1.Akechi.fileExists(pathToPersonalizations)) {
                personalizations[tag] = {
                    default: defaultText,
                    personalizations: [],
                };
                yield Akechi_1.Akechi.writeYamlFile(pathToPersonalizations, personalizations);
                return defaultText;
            }
            // Attempt to get the personalizations with Akechi.
            personalizations = yield Akechi_1.Akechi.readYamlFile(pathToPersonalizations);
            // First thing's first, we check the personalizations. If the tag is not set, we return the text 'as is'.
            if (personalizations[tag] === undefined) {
                personalizations[tag] = {
                    default: defaultText,
                    personalizations: [],
                };
                yield Akechi_1.Akechi.writeYamlFile(pathToPersonalizations, personalizations);
                return defaultText;
            }
            // Perform a quick sync. If the personalizations default text is not the same, update it.
            if (personalizations[tag].default !== defaultText) {
                personalizations[tag].default = defaultText;
                yield Akechi_1.Akechi.writeYamlFile(pathToPersonalizations, personalizations);
            }
            // If the personalizations array is empty, return the default text.
            if (Sojiro_1.Sojiro.isEmpty(personalizations[tag].personalizations)) {
                return defaultText;
            }
            // We fetch the text from the personalizations.
            let text = personalizations[tag].personalizations;
            // If the text is an array, we fetch a random element from it.
            // This is fun, because you can have varying texts.
            if (Array.isArray(text)) {
                text = Sojiro_1.Sojiro.getRandomElementFromArray(text);
            }
            // Return the text.
            return text;
        });
    }
}
exports.Yoshida = Yoshida;
/**
 * Field to hold a boolean value determining whether translation was initialized or not.
 */
Yoshida.translationInitialized = false;
