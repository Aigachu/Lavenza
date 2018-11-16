/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// This file is quite simply to manage application wide globals.

// Yeah...That's it.

/**
 * === Packages ===
 * Must run 'npm install' in the 'app' folder if any of these packages are not found.
 * It is important to user 'npm install --save' if new packages are added during development. This will update packages.json to include new dependencies.
 */
global.Packages = {

  // Core Modules.
  path: require('path'),
  fs: require('fs'),
  util: require('util'),

  // Colors
  // We want to be fly.
  /** @see https://www.npmjs.com/package/colors */
  colors: require('colors'),

  // Application Root Path
  /** @see https://github.com/inxilpro/node-app-root-path */
  arp: require('app-root-path'),

  // Name That Color
  /** @see http://chir.ag/projects/ntc */
  ntc: require('../../custom_modules/ntc'),

  // Twitch API (V5)
  Twitch: require('twitch-api-v5'),

  // Use Glob to match file patterns.
  /** @see https://www.npmjs.com/package/glob */
  glob: require('glob'),

  // A whole "mess" of utility functions!
  /** @see https://www.npmjs.com/package/underscore */
  _: require('underscore'),

  // Discord.Js library. Thank you Hydrabolt!
  /** @see https://github.com/discordjs/discord.js */
  DiscordJS: require('discord.js'),

  // Google...Self-explanatory.
  /** @see https://www.npmjs.com/package/google */
  google: require('google'),

  // Moment for time management operations.
  /** @see https://www.npmjs.com/package/moment */
  moment: require('moment'),

  // YAML parser for JS.
  /** @see https://www.npmjs.com/package/js-yaml */
  yaml: require('js-yaml'),

  // Twitch Integration API
  /** @see https://docs.tmijs.org/v1.2.1/Twitch-API.html */
  tmi: require('tmi'),

};

// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
Packages.colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  status: 'yellow',
  debug: 'blue',
  error: 'red'
});

/**
 * === Keys ===
 * Keys are specific strings that the application will sometimes look for.
 * Consider this core configuration that is easy to change if ever.
 */
global.Keys = {

  // The name of the bot config file the application will search for.
  BOT_CONFIG_FILE_NAME: 'config.yml',

  // The name of the folder containing the different bots.
  BOT_FOLDER_NAME: 'bots',

};

/**
 * === Paths ===
 * We keep a list of paths here to avoid having to fetch them all the time.
 */
global.Paths = {};

// Provide global variable exposing path to the root of the application.
global.Paths.ROOT = Packages.arp.path;

// Provide global variable exposing path to the bots folder.
global.Paths.BOTS = Paths.ROOT + '/' + Keys.BOT_FOLDER_NAME;
