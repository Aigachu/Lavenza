/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Custom Modules.
const ntc = require('./ntc');

/**
 * Paint command.
 */
class Paint extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {
    // @todo - Check if the bot is at the top of the role list and has the proper permissions.

    // If the "c" option is used, a color role will be created.
    if ("c" in order.args) {
      this.createColor(order.args.c, resonance);
    }

    // If the "s" option is used, a color role will be set to the invoker.
    if ("s" in order.args) {
      this.setColor(order.args.s, resonance);
    }

    // If the "r" option is used, a color role will be removed from the invoker.
    if ("r" in order.args) {
      this.removeColorFromMember(resonance, resonance.message.member);
    }

    // If the "l" option is used, list all color roles in the server.
    if ("l" in order.args) {
      this.listColorRolesInGuild(resonance);
    }

    // If the "x" option is used, delete all color roles in the server.
    if ("x" in order.args) {
      this.deleteAllColorRoles(resonance);
    }

  }

  /**
   * Create a color with the given input.
   * @param  {String} input Input given for the color to create.
   * @param  {Object} resonance  Command data retrieved through parsing.
   * @return {Boolean}      True upon success. False upon failure.
   */
  static createColor(input, resonance) {

    // Get the Color data.
    let color = this.getColorData(input, resonance);

    // If the color data wasn't properly fetched.
    if (!color) {
      return false;
    }

    // Get the color role in the current guild if it exists already.
    let foundColor = this.findColorInCurrentGuild(color, resonance);

    // Check if the color already exists.
    if (foundColor !== false) {
      resonance.message.channel.send(`Seems like that color already exists! - <@&` + foundColor.id + `>`);
      return false;
    }

    // Create the color role with the proper values.
    resonance.message.guild.createRole({
      name: color.name,
      color: input,
      mentionable: true,
      permissions: resonance.message.guild.defaultRole.permissions,
    })
      .then((role) => {
        role.setPosition(resonance.message.guild.roles.array().length - 2)
          .then(() => {
            resonance.message.channel.send(`I've successfully created a new color in this server: ` + role);
          })
          .catch((error) => {
            resonance.message.channel.send(`An error may have occurred with the creation of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't deal well with roles that are above mine. :( You're going to have to move me to the top of your server role list!`);
            console.error(error);
          });
      })
      .catch((error) => {
        resonance.message.channel.send(`An error may have occurred with the creation of the color.\nI may not have permissions to create roles in this server. You will have to give me the **Manage Roles** permission!`);
        console.error(error);
      });

    return true;
  }

  /**
   * Set Color to a member.
   * @param    {String} input    Input from the user issuing the command.
   * @param    {Object} resonance    Data obtained from parsing the command.
   * @return    {Boolean}                True upon success. False upon failure.
   */
  static setColor(input, resonance) {

    // Get the color data.
    let color = this.getColorData(input, resonance);

    // If a color wasn't obtained, we do nothing.
    if (!color) {
      return false;
    }

    // Get the color role that will be set.
    let colorRoleToSet = this.findColorInCurrentGuild(color, resonance);

    // Check if the color exists.
    // If it doesn't, we can't set it. We'll tell the user that they must create it.
    if (colorRoleToSet === false) {
      resonance.message.reply(`Seems like that color doesn't exist! You have to create it first. :O`)
        .then((reply) => {
          // Do nothing with reply.
        }).catch(console.error);
      return false;
    }

    // Check if the member currently has a color.
    let memberCurrentColorRole = this.getMemberColorInCurrentGuild(resonance.message.member);

    // If someone tries to set the same color more than once...
    if (memberCurrentColorRole !== false && memberCurrentColorRole.id === colorRoleToSet.id) {
      resonance.message.reply(`hey, you already have that color! I can't paint you with the same color twice. xD`)
        .then((reply) => {
          // Do nothing with reply.
        }).catch(console.error);
      return false;
    }

    // Remove color if the member has one already.
    if (memberCurrentColorRole !== false) {
      // Remove color if one is set.
      this.removeColorFromMember(resonance, resonance.message.member);
    }

    // Add the color to the member.
    resonance.message.member.addRole(colorRoleToSet)
      .then(() => {
        resonance.message.reply(`all done! You look great in ${colorRoleToSet.name.replace('.color', '')}! ;) :sparkles:`)
          .then((reply) => {
            // Do nothing with reply.
          }).catch(console.error);
      })
      .catch((error) => {
        resonance.message.author.send(`An error may have occurred with the setting of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't set roles that are above mine. :( You're going to have to move me to the top of your server role list!`);
        console.error(error);
      });

    return true;

  }

  /**
   * Remove color from a member.
   * Color doesn't need to be specified because users can only have 1 color at once.
   * @param  {Object}               resonance    Data from the parsed command.
   * @param  {GuildMember} member  Guild member to clean color from.
   */
  static removeColorFromMember(resonance, member) {

    // Fetch color role from the member.
    let memberCurrentColorRole = this.getMemberColorInCurrentGuild(member);

    // If there's no color to remove, then we can just return. Nothing to do.
    if (memberCurrentColorRole === false) {
      return false;
    }

    // Remove the role and send confirmation message.
    // Error message if something went wrong.
    // If an error happens, the bot may not have permissions to tamper with the member's roles.
    member.removeRole(memberCurrentColorRole)
      .then(() => {
        resonance.message.channel.send(`You're all cleaned up! :sparkles:`);
      })
      .catch((error) => {
        resonance.message.author.send(`An error may have occurred with the removing of the color.\nThis is most likely caused by the fact that my bot role may not be at the top of the role list in your server. I can't set roles to users that have a role above mine. :( You're going to have to move me to the top of your server role list!`);
        console.error(error);
      });

  }

  /**
   * Try to find the color in the given guild and get the data.
   * @param  {string} input Input obtained from the command. This SHOULD be a Hex value of a color.
   * @param  {Object} resonance  Data obtained from parsing the command.
   * @return {Object}       An object containing the HEX value of the color and the name of the color.
   */
  static getColorData(input, resonance) {

    // Try to get a color by name first if the input is a name.
    // If it's found, we'll return the values and mark it as existing.
    let color = resonance.message.guild.roles.find(role => role.name === input + '.color');
    if (color !== null) {
      return {hex: color.hexColor, name: color.name, exists: true};
    }

    // Try to get a color by role name if they enter the complete role name.
    // If it's found, we'll return the values and mark it as existing.
    color = resonance.message.guild.roles.find(role => role.name === input);
    if (color !== null) {
      return {hex: color.hexColor, name: input, exists: true};
    }

    // At this point, we know the input is possibly a hex value.
    let colorHex = input;

    // Make sure the # is prepended.
    // Convenience. Users will be able to enter the rgb in hex without the # if they want.
    if (colorHex.indexOf("#") !== 0) {
      colorHex = "#" + colorHex;
    }

    // Check if the hex color is valid.
    if (!this.isHexColor(colorHex)) {
      resonance.message.reply(`That seems to be an invalid HEX value or color name!`)
        .then((reply) => {
          // Do nothing with reply.
        }).catch(console.error);
      return false;
    }

    // Get a name for the color using the NTC library.
    let colorName = ntc.name(colorHex)[1] + ".color";

    // Return the color data.
    return {hex: colorHex, name: colorName};
  }

  /**
   * Attempt to find a color in the current guild.
   * @param  {Object} colorData    Object containing color hex and color name.
   * @param  {Object} resonance            Command data obtained from parsing.
   * @return {Role|Boolean}            Return the role object if found, else return FALSE.
   */
  static findColorInCurrentGuild(colorData, resonance) {

    // Try to find the color through Hex Value.
    let color = resonance.message.guild.roles.find(role => role.hexColor === colorData.hex);
    if (color !== null) {
      return color;
    }

    // Try to find the color through name.
    color = resonance.message.guild.roles.find(role => role.name === colorData.name);
    if (color !== null) {
      return color;
    }

    // If we reach here, color was not found. We'll return false.
    return false;

  }

  /**
   * Get color assigned to a member in the current guild.
   * @param  {GuildMember} member    Member discord object.
   * @return {Role/Boolean}                Role Discord Object of the color found.
   */
  static getMemberColorInCurrentGuild(member) {

    // Variable to store the color role. The False by default.
    let color = false;

    // Loop into all roles of the given member and attempt to find a color role.
    // Color roles all have the '.color' suffix.
    member.roles.every((role) => {
      if (role.name.includes('.color')) {
        color = role;
        return false; // This ends execution of the .every() function.
      }

      return true;
    });

    // Return whatever is in the color variable at this point.
    // Will be false if none were found.
    return color;
  }

  /**
   * List all color roles in the given guild.
   * @param  {Object} resonance Data from the parsed command.
   * @return {[type]}      [description]
   */
  static listColorRolesInGuild(resonance) {

    // Variable that will store the message to be sent, listing all color roles in the guild.
    let list_msg = `Here is the list of all colors in this server:\n\n`;

    // Loop in the guild's roles and check for all color roles.
    resonance.message.guild.roles.every((role) => {

      // If a color role is found, we'll append it to the list.
      if (role.name.includes('.color')) {
        list_msg += `  - ${role.name.replace('.color', '')} \`${role.hexColor}\`\n`;
      }

      return true;

    });

    // Send the text to the channel.
    // We add a delay for some flavor. Don't actually need it.
    resonance.message.channel.send(`_Scanning available colors in this server..._`)
      .then(() => {
        resonance.message.channel.startTyping(1);
        Lavenza.wait(3).then(() => {
          if (list_msg === `Here is the list of all colors in this server:\n\n`) {
            resonance.message.channel.send(`There are no colors in this server! Better start creating some. :)`);
          } else {
            resonance.message.channel.send(list_msg);
          }
          resonance.message.channel.stopTyping();
        });
      });

  }

  /**
   * Delete all color roles for a given guild.
   * @param  {Object} resonance Data from the parsed command.
   */
  static deleteAllColorRoles(resonance) {

    // Loops into the roles of the guild and deletes all color roles.
    resonance.message.guild.roles.every((role) => {
      if (role.name.includes('.color')) {
        role.delete()
          .then(r => console.log(`Deleted color role ${r}`))
          .catch(console.error);
      }
      return true;
    });

    resonance.message.reply(`I have cleared all color roles from the server. :)`)
      .then((reply) => {
        // Do nothing with reply.
      }).catch(console.error);
  }

  /**
   * Returns whether or not the given string is a Hex value.
   * @param  {String}  string Supposed Hex Value.
   * @return {Boolean}        True if it's a valid Hex Value. False if it's not.
   */
  static isHexColor(string) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string);
  }

}

module.exports = Paint;