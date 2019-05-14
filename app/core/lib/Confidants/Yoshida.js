/**
 * Project Lavenza-II
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class that handles Dictionary and Database management.
 *
 * Another name for this could be the TextManager.
 *
 * Yoshida handles speech, and the importance of expressing oneself properly. So this class as such will handle
 * personalization of texts.
 */
export default class Yoshida {

  /**
   * Get a personalization for a given text from a bot's configurations.
   *
   * @param {string} defaultText
   *   Default text that should be returned if personalizations don't exist.
   * @param {string} tag
   *   Tag, or key, of the personalization in the configurations.
   * @param {Bot} bot
   *   The Bot we should fetch personalizations for.
   *
   * @returns {Promise<*>}
   */
  static async getPersonalization(defaultText, tag, bot) {

    // Check if the tag formatting is permitted.
    // We hard crash if this isn't the case. Tags should always be defined with "::" as the first characters.
    if (!tag.startsWith('::')) {
      await Lavenza.throw(`Invalid format for tag '{{tag}}'. All tags should start with "::". Please change your tag in the code.`, {tag: tag});
    }

    // Determine path to personalizations file.
    let pathToPersonalizations = bot.directory + '/personalizations.yml';

    // If personalizations don't exist, simply return the default text.
    if (!Lavenza.Akechi.fileExists(pathToPersonalizations)) {
      let personalizations = {};
      personalizations[tag] = {
        'default': defaultText,
        'personalizations': []
      };
      await Lavenza.Akechi.writeYamlFile(pathToPersonalizations, personalizations);
      return defaultText;
    }

    // Attempt to get the personalizations with Akechi.
    let personalizations = await Lavenza.Akechi.readYamlFile(pathToPersonalizations);

    // First thing's first, we check the personalizations. If the tag is not set, we return the text 'as is'.
    if (personalizations[tag] === undefined) {
      personalizations[tag] = {
        'default': defaultText,
        'personalizations': []
      };
      await Lavenza.Akechi.writeYamlFile(pathToPersonalizations, personalizations);
      return defaultText;
    }

    // Perform a quick sync. If the personalizations default text is not the same, update it.
    if (personalizations[tag]['default'] !== defaultText) {
      personalizations[tag]['default'] = defaultText;
      await Lavenza.Akechi.writeYamlFile(pathToPersonalizations, personalizations);
    }

    // If the personalizations array is empty, return the default text.
    if (Lavenza.isEmpty(personalizations[tag]['personalizations'])) {
      return defaultText;
    }

    // We fetch the text from the personalizations.
    let text = personalizations[tag]['personalizations'];

    // If the text is an array, we fetch a random element from it.
    // This is fun, because you can have varying texts.
    if (Array.isArray(text)) {
      text.push(defaultText);
      text = Lavenza.getRandomElementFromArray(text);
    }

    // Return the text.
    return text;
  }

}