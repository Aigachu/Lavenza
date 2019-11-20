/**
 * @file
 * Functional entry to Lavenza's Framework for the {BOT_NAME} bot.
 *
 * @bot {BOT_MACHINE_NAME}
 * @author {AUTHOR_NAME}
 * @version {BOT_VERSION_NUMBER}
 * @description {BOT_DESCRIPTION}
 */
module.exports = {

  /**
   * Listen to a resonance (message) heard by {BOT_NAME}, and act upon it.
   *
   * @param resonance
   *   The message heard by {BOT_NAME}. Feel free to 'console.log' this object to find a lot of useful information about
   *   the message itself!
   */
  resonate: async (resonance) => {
    // If the raw content of the message is "hello", reply with 'Hello world!'.
    if (resonance.content === "hello") {
      await resonance.reply('Hello world!');
    }
  }

};
