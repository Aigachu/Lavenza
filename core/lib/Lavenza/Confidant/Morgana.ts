/* tslint:disable:no-unnecessary-initializer */
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Yoshida } from "./Yoshida";

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * Another name for this could be the LoggerManager.
 *
 * My thought process? Well Morgana talks a lot in P5. So I named my console
 * manager after him. Clever right? Haha!
 *
 * Honestly I just needed an excuse to use their names in my code. And I love it.
 */
export class Morgana {

  /**
   * Send output to the console.
   *
   * @param message
   *   The text to send to the console, or in some/most cases the ID of the
   *   string to send. If an ID is sent, text will be fetched from Dictionaries.
   * @param replacers
   *   If an object of strings is set here, it will be used to replace any
   *   placeholders in the text provided above.
   * @param type
   *   Type of console log to print.
   * @param locale
   *   Set the locale to determine the language.
   */
  public static async log(
    message: string,
    replacers: {} = undefined,
    type: string = "default",
    locale: string = process.env.DEFAULT_LOCALE,
  ): Promise<void> {
    // Fetch translations of output.
    // Setting 'any' since we're using the 'colors' module here but TS can't tell.
    // tslint:disable-next-line:no-any
    let output: any = await Yoshida.translate(message, replacers, locale);
    output = `${output}`;

    // Depending on the type, we send different types of outputs.
    switch (type) {
      // Status messages.
      case "status": {
        console.log(output.status);
        break;
      }

      // Warning messages.
      case "warning": {
        console.log(output.warning);
        break;
      }

      // Success messages.
      case "success": {
        console.log(output.success);
        break;
      }

      // Error messages.
      case "error": {
        // Send default error message.
        console.log(output.error);
        break;
      }

      // Wonderful messages.
      case "wonderful": {
        console.log(output.silly);
        break;
      }


      // By default, do a regular log.
      default: {
        console.log(output);
      }
    }
  }

  /**
   * Shortcut function to send a success message.
   * @inheritDoc
   */
  public static async success(message: string, replacers: {} = undefined): Promise<void> {
    // If the message is not set, we'll fetch the default success message.
    const messageToSend: string = message || "SUCCESS";
    await Morgana.log(messageToSend, replacers, "success");
  }

  /**
   * Shortcut function to set a status message.
   * @inheritDoc
   */
  public static async status(message: string, replacers: {} = undefined): Promise<void>  {
    await Morgana.log(message, replacers, "status");
  }

  /**
   * Shortcut function to set a wonderful message.
   * @inheritDoc
   */
  public static async wonderful(message: string, replacers: {} = undefined): Promise<void>  {
    await Morgana.log(message, replacers, "wonderful");
  }

  /**
   * Shortcut function to set a warning message.
   * @inheritDoc
   */
  public static async warn(message: string, replacers: {} = undefined): Promise<void>  {
    await Morgana.log(message, replacers, "warning");
  }

  /**
   * Shortcut function to set a error message.
   * @inheritDoc
   */
  public static async error(message: string, replacers: {} = undefined): Promise<void>  {
    // If the message is not set, we'll fetch the default error message.
    const messageToSend: string = message || "ERROR";
    await Morgana.log(messageToSend, replacers, "error");
  }

}
