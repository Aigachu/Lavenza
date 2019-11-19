/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { DiscordClient } from "../../../../../../lib/Lavenza/Client/Discord/DiscordClient";
import { DiscordResonance } from "../../../../../../lib/Lavenza/Client/Discord/DiscordResonance";
import { Yoshida } from "../../../../../../lib/Lavenza/Confidant/Yoshida";
import { ServiceContainer } from "../../../../../../lib/Lavenza/Service/ServiceContainer";
import { Instruction } from "../../../Instruction/Instruction";
import { CommandComposer } from "../../../Service/CommandComposer";
import { CommandHelpHandler } from "../../CommandHelpHandler/CommandHelpHandler";

/**
 * Provides an abstract class for Help Handlers.
 *
 * Help handlers are simple classes that determine what to do when the help argument is invoked for a command.
 */
export class DiscordCommandHelpHandler extends CommandHelpHandler {

  /**
   * Method that handles what happens when the help argument is invoked.
   *
   * @param instruction
   *   Instruction to fire the help handler for.
   */
  public async help(instruction: Instruction): Promise<void> {
    // Variables & utility.
    const command = instruction.command;
    const bot = instruction.resonance.bot;
    const client = instruction.resonance.client as DiscordClient;
    const resonance = instruction.resonance as DiscordResonance;

    // Get configuration.
    const config = await ServiceContainer.get(CommandComposer).getActiveCommandConfigForBot(command, bot);
    const parameterConfig = await await ServiceContainer.get(CommandComposer).getActiveParameterConfigForBot(command, bot);

    // Start building the usage text by getting the command prefix.
    let usageText = `\`${instruction.prefix}${config.key}`;

    // If there is input defined for this command, we will add them to the help text.
    if (parameterConfig.input) {
      parameterConfig.input.requests.every((request) => {
        usageText += ` {${request.replace(" ", "_")
          .toLowerCase()}}\`\n`;
      });
    } else {
      usageText += "`\n";
    }

    // If there are aliases defined for this command, add all usage examples to the help text.
    if (config.aliases) {
      const original = usageText;
      config.aliases.every((alias) => {
        usageText += original.replace(`${config.key}`, alias);

        return true;
      });
    }

    // Set the usage section.
    const fields = [
      {
        name: await Yoshida.translate("Usage", resonance.locale),
        text: usageText,
      },
    ];

    // If there are options defined for this command, we add a section for options.
    if (parameterConfig.options) {
      let optionsList = "";
      await Promise.all(parameterConfig.options.map(async (option) => {
        const description = await Yoshida.translate(option.description, resonance.locale);
        const name = await Yoshida.translate(option.name, resonance.locale);
        optionsList += `**${name}** \`-${option.key} {${option.expects.replace(" ", "_")
          .toLowerCase()}}\` - ${description}\n\n`;
      }));
      fields.push(
        {
          name: await Yoshida.translate("Options", resonance.locale),
          text: optionsList,
        });
    }

    // If there are flags defi-...You get the idea.
    if (parameterConfig.flags) {
      let flagsList = "";
      await Promise.all(parameterConfig.flags.map(async (flag) => {
        const description = await Yoshida.translate(flag.description, resonance.locale);
        const name = await Yoshida.translate(flag.name, resonance.locale);
        flagsList += `**${name}** \`-${flag.key}\` - ${description}\n\n`;
      }));
      fields.push(
        {
          name: await Yoshida.translate("Flags", resonance.locale),
          text: flagsList,
        });
    }

    // Finally, send the embed.
    await client.sendEmbed(resonance.message.channel, {
      description: await Yoshida.translate(`${config.description}`, resonance.locale),
      fields,
      header: {
        icon: client.connector.user.avatarURL,
        text: await Yoshida.translate("{{bot}} Guide", {bot: bot.config.name}, resonance.locale),
      },
      thumbnail: client.connector.user.avatarURL,
      title: await Yoshida.translate(`${config.name}`, resonance.locale),
    });
  }

}
