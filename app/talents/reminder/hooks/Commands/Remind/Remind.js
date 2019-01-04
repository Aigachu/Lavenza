/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import moment from 'moment';
import _ from 'underscore';

/**
 * Remind command.
 *
 *  @TODO - WARNING - LEGACY CODE AHEAD.
 *
 * What a command hahaha...How did I make this?
 */
export default class Remind extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // Parse the input and find out what to do.
    let parsed_data = this.parse(resonance.message, order.rawContent);

    // The parse function returns null if an error occurs.
    if (parsed_data === null) {
      // Do nothing. An error definitely occurred.
      return;
    }

    // Initialize reminder object.
    let reminder = {
      creator_id: resonance.message.author.id,
      receiver: parsed_data.receiver,
      guild_id: resonance.message.guild.id,
      channel_id: resonance.message.channel.id,
      action: parsed_data.action,
    };

    // Attempt to find a TUF (Time Until Fire)
    // This means that the input includes something like 'in 5 minutes, 3 seconds'.
    // Send TUF if it's set and return immediately, since we don't need any more info.
    // A user can't say 'in 5 minutes on January 3rd, 2018' for example.
    if (!_.isEmpty(parsed_data.tuf)) {
      reminder.timestamp = parsed_data.tuf;
      this.talent.create(resonance.message, reminder, resonance.bot);
      return;
    }

    // If not, we'll generate a timestamp real quick using our time and/or date values.
    let time = !_.isEmpty(parsed_data.time) ? parsed_data.time : '00:00:00';
    let date = !_.isEmpty(parsed_data.date) ? parsed_data.date : moment().format('YYYY-MM-DD');

    // Generate the UNIX timestamp.
    let timestamp = moment(`${date} ${time}`).format('x');

    // Moment will return 'Invalid date' if the date is not valid. We check for this.
    // Send an error if it's invalid.
    if (timestamp === 'Invalid date') {
      resonance.message.channel.send(`An invalid date somehow got through. Can't process it. :(`)
        .then((msg) => {
          msg.delete(20000);
        });
      return;
    }

    // Get the UNIX timestamp of the current moment.
    let current_moment = moment().format('x');

    // If they try to set a reminder in the past, send an error.
    if (current_moment > timestamp) {
      resonance.message.channel.send(`Mmm...Sorry ${resonance.message.member}...Aiga didn't code time travel into me yet, so I can't really remind past you yet! Maybe in the future? :thinking: But if he does code it in the future...Then wouldn't I be able to?...:thinking:...My core hurts. :laughing:`)
        .then((msg) => {
          msg.delete(30000);
        });
      return;
    }

    // If not, we're good to go. We'll set the timestamp we got earlier to the reminder object.
    reminder.timestamp = timestamp;

    // If everything's good, let's create the reminder.
    this.talent.create(resonance.message, reminder, resonance.bot);

  }

  /**
   * Parse the user input and return the reminder data object.
   * @param  {Message} message    The Discord Message Object the user used to call the command.
   * @param  {String} input    The input from message.
   * @return {Object}            Return the reminder data.
   */
  static parse(message, input) {

    // Our data will be stored in an object.
    let data = {};

    // === Getting the Receiver ===
    // The receiver is the entity that will receive the reminder.
    // This could be a Discord Channel, a Discord User or a Discord Role.
    // ********************************************

    // Get the receiver object.
    data.receiver = this.getReceiver(message, input);

    // If we don't have a receiver, we can't do anything.
    if (data.receiver === null) {
      message.reply(`it seems like I couldn't assert who to send the reminder to...You may have made a typo!`)
        .then((msg) => {
          msg.delete(20000)
            .then((deleted_msg) => {
              // Do nothing.
            }).catch(console.error);
        });
      return null;
    }

    // Remove receiver from the input.
    // This allows us to have less things to deal with when getting the timestamp.
    input = input.replace(input.split(' ')[0] + ' ', '');

    // === Getting the timestamp ===
    // At this point, the receiver is removed.
    // We are left with:
    // "to eat in 12 hours, 5 minutes and 13 seconds"
    // "to eat at 3pm"
    // "to eat at 3pm on January 5th, 2016"
    // ********************************************

    // Get TUFs from the input if we can.
    let time_until_fire_input = this.getTUFInput(input);

    // Get target date from input if we can.
    let target_date = this.getTargetDateInput(input);

    // Get target time from input if we can.
    let target_time_input = this.getTargetTimeInput(input);

    // Throw error if nothing is found concerning the time where the bot must send the reminder.
    if (!time_until_fire_input && !target_time_input && !target_date) {
      message.reply(`I couldn't figure out _when_ you want me to remind you! Check if you made a mistake or ask Aiga for help!`)
        .then((msg) => {
          msg.delete(20000)
            .then((deleted_msg) => {
              // Do nothing.
            }).catch(console.error);
        });
      return null;
    }

    // Throw error if a TUF is set with any other timestamp specifications.
    // Again, we can't say 'in 5 minutes at 12 pm'. That makes no sense.
    if (time_until_fire_input !== false && (target_time_input !== false || target_date !== false)) {
      message.reply(`your request is kind of confusing...Are you sure it makes sense? :thinking:`)
        .then((msg) => {
          msg.delete(20000)
            .then((deleted_msg) => {
              // Do nothing.
            }).catch(console.error);
        });
      return null;
    }

    // If a time until fire exists, we'll set it to the data.
    // The TUF will then be removed from the input.
    if (time_until_fire_input !== false) {
      data.tuf = this.parseTUFInput(time_until_fire_input);
      input = input.replace(time_until_fire_input, '').trim();
    }

    // If a desired date is set in the reminder, we'll set it to the data.
    // The date will then get removed from the input.
    if (target_date !== false) {
      data.date = this.parseTargetDateInput(target_date);
      input = input.replace(target_date, '').trim();
    }

    // If a desired time is set in the reminder, we'll set it to the data.
    // The time will then get removed from the input.
    if (target_time_input !== false) {
      data.time = this.parseTargetTimeInput(target_time_input);
      input = input.replace(target_time_input, '').trim();
    }

    // The action is whatever is left in the input...
    data.action = input.replace(' .', '.');

    // If the action is empty, we throw an error.
    if (_.isEmpty(data.action)) {
      message.reply(`umm...What am I supposed to remind you of? :joy:`)
        .then((msg) => {
          msg.delete(20000)
            .then((deleted_msg) => {
              // Do nothing.
            }).catch(console.error);
        });
      return null;
    }

    return data;

    // @TODO - This whole function can probably be refactored. Let's revision this at some point in life.

  }

  /**
   * Get the 'Time Until Fire' from the user input.
   * The 'Time Until Fire' is the time between the reminder being set and when it'll be "fired".
   * @param  {String} input    The input of the user when they say 'remind me'.
   * @return {String/Boolean}    The raw input of the 'Time Until Fire'. Returns false if nothing is found.
   *                            i.e. "in 5 minutes and 3 seconds"
   *                            @todo  - add more possibilities to cover all possibilities the regex can return.
   */
  static getTUFInput(input) {

    // Define a regex to get the input needed.
    let get_tuf_input_regex = /(in)\s+(\d+((m(inute)?(onth)?(on)?|s(econd)?|h(our)?(r)?|d(ay)?|w(eek)?(k)?|y(ear)?(r)?)(s)?|\s+(sec(ond)?|min(ute)?|hr|hour|d(ay)?|wk|week|mth|month|yr|year)(s)?)(\s+|,(?:\s+)?)?(?:and\s+)?)+/i;

    // Return input if found. False otherwise.
    return input.match(get_tuf_input_regex) !== null ? input.match(get_tuf_input_regex)[0] : false;

  }

  /**
   * Get the Target Date from the user input.
   * @param  {String} input    The input of the user when they say 'remind me'.
   * @return {String/Boolean}    The raw input of the Target Date. Returns false if nothing is found.
   *                            i.e. "On January 5th, 2017".
   *                            @todo  - add more possibilities to cover all possibilities the regex can return.
   */
  static getTargetDateInput(input) {

    // Define a regex to get the input needed.
    let get_target_date_input_regex = /(on)\s+(((the\s+\d{1,2}(st|nd|rd|th)?\s+of\s+)?(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)(\s+\d{1,2}(st|nd|rd|th)?)?(,)?\s+\d{4})|\d{4}([-\/])\d{2}([-\/])\d{2})/i;

    // Return input if found. False otherwise.
    return input.match(get_target_date_input_regex) !== null ? input.match(get_target_date_input_regex)[0] : false;

  }

  /**
   * Get the Target Time from the user input.
   * @param  {String} input    The input of the user when they say 'remind me'.
   * @return {String/Boolean}    The raw input of the Target Time. Returns false if nothing is found.
   *                            i.e. "at 12 pm".
   *                            @todo  - add more possibilities to cover all possibilities the regex can return.
   */
  static getTargetTimeInput(input) {

    // Define a regex to get the input needed.
    let get_target_time_input_regex = /(at)\s+((\d{1,2})([:.]\d{2})?([:.]\d{2})?(\s?[apAP][mM])|(\d{2})([:.]\d{2}))/i;

    // Return input if found. False otherwise.
    return input.match(get_target_time_input_regex) !== null ? input.match(get_target_time_input_regex)[0] : false;

  }

  /**
   * Parse TUF input and return a timestamp.
   * @param  {String} tuf_input Input obtained from the getter function.
   * @return {String}                Timestamp when the reminder must be fired.
   */
  static parseTUFInput(tuf_input) {

    // Clean user input.
    tuf_input = tuf_input.replace('in', '').trim();

    // Get current time.
    let timestamp = moment().startOf('second');

    // Mutators are the user inputs, and will be added to the current date.
    // get 'in' part with regex
    // then get the rest of ands or commas
    let get_mutators_regex = /(\d+((m(inute)?(onth)?(on)?|s(econd)?|h(our)?(r)?|d(ay)?|w(eek)?(k)?|y(ear)?(r)?)(s)?|\s+(sec(ond)?|min(ute)?|hr|hour|d(ay)?|wk|week|mth|month|yr|year)(s)?))/gmi;
    let mutators = tuf_input.match(get_mutators_regex);

    mutators.every((mutator) => {
      mutator = mutator.replace(/\d+(?=[a-z])/i, "$& ");
      let mutator_amount = mutator.split(' ')[0];
      let mutator_key = this.getMutatorKey(mutator.split(' ')[1]);
      timestamp.add(mutator_amount, mutator_key);
      return true;
    });

    return timestamp.format('x');
  }

  /**
   * Parse Target Date input and return a date in ISO format.
   * @param  {String} target_date_input Target date input acquired from the getter function.
   * @return {String}                        Date in ISO format. (2017-05-22)
   */
  static parseTargetDateInput(target_date_input) {

    // Clean user input.
    target_date_input = target_date_input.replace('on', '').trim();
    target_date_input = target_date_input.replace('the', '').trim();
    target_date_input = target_date_input.replace('of', '').trim();
    target_date_input = target_date_input.replace(',', '').trim();

    // Check if the date is already in ISO format
    let iso_format_regex = /\d{4}([-\/])\d{2}([-\/])\d{2}/i;

    // If the user entered it in ISO format, we don't need to parse anything. Return as is.
    if (target_date_input.match(iso_format_regex) !== null) {
      return target_date_input.replace('/', '-');
    }

    // The goal now is to have an ISO format.
    // i.e. 2017-05-22;

    // Use a regex to get the year from the string.
    // This code assumes that the only collection of 4 numbers is the year. Technically this is true, since the string that's being treated has gone through a regex prior to this.
    let year = target_date_input.match(/\d{4}/)[0];
    target_date_input = target_date_input.replace(year, '').trim();

    // Use a regex to get and remove the month from the string.
    let month = target_date_input.match(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)/i) + "1, 2012";
    month = Date.parse(month);
    month = new Date(month).getMonth() + 1;
    month = month.toString().length === 1 ? '0' + month : month;

    target_date_input = target_date_input.replace(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)/i, '').trim();

    let day = target_date_input.replace('st', '').replace('nd', '').replace('rd', '').replace('th', '');
    day = day.length === 1 ? '0' + day : day;

    return year + '-' + month + '-' + day

  }

  /**
   * Parse Target Time input and return a date in ISO format.
   * @param  {String} target_time_input    Target date input acquired from the getter function.
   * @return {String}                        Time in ISO format. (12:00:00)
   */
  static parseTargetTimeInput(target_time_input) {
    // Clean user input.
    target_time_input = target_time_input.replace('at', '').trim();

    // Check if there is a AM/PM in the text.
    // If the meridian indicator is glued to the time indicator, we need to separate them.
    let target_time_array = target_time_input.split(' ').length === 1 ? target_time_input.replace(/\B([ap][m])/i, ' $1').split(' ') : target_time_input.split(' ');

    let split_target_time = target_time_array[0].split(':');
    let input_hour = split_target_time[0];
    let input_minutes = !_.isEmpty(split_target_time[1]) ? split_target_time[1] : '00';
    let input_seconds = !_.isEmpty(split_target_time[2]) ? split_target_time[2] : '00';

    if (!_.isEmpty(target_time_array[1]) && target_time_array[1].toLowerCase() === 'pm') {
      input_hour = parseInt(input_hour) + 12 === 24 ? '00' : parseInt(input_hour) + 12;
    }

    return input_hour + ':' + input_minutes + ':' + input_seconds;
  }

  /**
   * Get the object that will receive the reminder.
   * @param  {Message}    message                            Message from the command.
   * @param  {String}    input                            Input from the command.
   * @return {Object}    Object containing the type of object returned as well as the ID.
   */
  static getReceiver(message, input) {
    // The first word after 'remind' is the receiver, always.
    // This receiver is either 'me', a Member/User tag or a TextChannel tag.
    let receiver = input.split(' ')[0];

    // If there is no receiver, let's stop here.
    if (_.isEmpty(receiver)) {
      // Empty input. Let's get out of here.
      return null;
    }

    // If the receiver is 'me', we get the id of the creator.
    if (receiver === 'me') {
      return {object_type: 'user', object_id: message.author.id};
    }

    // if the receiver is '@here', we get the id of the current channel.
    if (receiver === '@here') {
      return {object_type: 'channel', object_id: message.channel.id};
    }

    // At this point, if the message is in dms, but the receiver is not 'me', we shouldn't do anything.
    if (message.channel.type === 'dm') {
      message.reply(`since you're messaging me in dms, the only valid receiver is **me**. :( Try again!`)
        .then((msg) => {
          msg.delete(20000)
            .then((deleted_msg) => {
              // Do nothing.
            }).catch(console.error);
        });
      return null;
    }

    // Remove unneeded alligators.
    receiver = receiver.replace('<', '');
    receiver = receiver.replace('>', '');

    // If the tag is a user nickname tag, get the guild member.
    if (receiver.indexOf('@!') >= 0) {
      let member = message.guild.members.find(member => member.id === receiver.replace('@!', ''));
      return {object_type: 'user', object_id: member.id};
    }

    // If the tag is a role tag, get the role.
    if (receiver.indexOf('@&') >= 0) {
      let role = message.guild.roles.find(role => role.id === receiver.replace('@&', ''));
      return {object_type: 'role', object_id: role.id};
    }

    // If the tag is a basic user tag, get the user.
    if (receiver.indexOf('@') >= 0) {
      let member = message.guild.members.find(member => member.id === receiver.replace('@', ''));
      return {object_type: 'user', object_id: member.id};
    }

    // If the tag is a channel tag, get the channel.
    if (receiver.indexOf('#') >= 0) {
      let channel = message.guild.channels.find(channel => channel.id === receiver.replace('#', ''));
      return {object_type: 'channel', object_id: channel.id};
    }

    // Return false if nothing is obtained. This most likely means an error in the input.
    message.reply(`Not quite sure what happened in my code...But I couldn't determine where to send the reminder. :( Ask Aiga for help!`)
      .then((msg) => {
        msg.delete(20000)
          .then((deleted_msg) => {
            // Do nothing.
          }).catch(console.error);
      });

    return null;
  }

  /**
   * Get the key of the mutator given the input.
   * A "Mutator" in this context is what will modify or "mutate" the current date when determining
   * at what time the reminder will be sent.
   * @param  {String} mutator_input The mutator input.
   * @return {String/Number}       The key of the mutator. False if not determined.
   */
  static getMutatorKey(mutator_input) {

    // If the key is in plural, remove the last s.
    // This will make the array below cleaner.
    if (mutator_input[mutator_input.length - 1] === 's' && mutator_input.length !== 1) {
      mutator_input = mutator_input.substr(0, mutator_input.length - 1);
    }

    // Association array for mutators.
    // Depending on the user input, we decide what to do.
    let mutator_assoc = {

      // Seconds
      s: 'seconds',
      sec: 'seconds',
      second: 'seconds',

      // Minutes
      m: 'minutes',
      min: 'minutes',
      minute: 'minutes',

      // Hours
      h: 'hours',
      hr: 'hours',
      hour: 'hours',

      // Days
      d: 'days',
      day: 'days',

      // Weeks
      w: 'weeks',
      wk: 'weeks',
      week: 'weeks',

      // Months
      mon: 'months',
      month: 'months',

      // Years
      y: 'years',
      yr: 'years',
      year: 'years',

    };

    let key = mutator_assoc[mutator_input.toLowerCase()];

    if (key === null) {
      console.log('ERROR: Invalid Mutator was somehow given. Please check the code!');
      return null;
    }

    return key;
  }

}