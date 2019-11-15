/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as Colors from "colors";
import * as DotEnv from "dotenv";

// Imports.
import { Command } from "../talents/commander/src/Command/Command";
import { CommandClientHandler } from "../talents/commander/src/Command/CommandClientHandler";

import { BotManager } from "./Lavenza/Bot/BotManager";
import { ClientType } from "./Lavenza/Client/ClientType";
import { Akechi } from "./Lavenza/Confidant/Akechi";
import { Igor } from "./Lavenza/Confidant/Igor";
import { Kawakami } from "./Lavenza/Confidant/Kawakami";
import { Morgana } from "./Lavenza/Confidant/Morgana";
import { Sojiro } from "./Lavenza/Confidant/Sojiro";
import { Yoshida } from "./Lavenza/Confidant/Yoshida";
import { Core } from "./Lavenza/Core/Core";
import { Gestalt } from "./Lavenza/Gestalt/Gestalt";
import { PromptException } from "./Lavenza/Prompt/Exception/PromptException";
import { PromptExceptionType } from "./Lavenza/Prompt/Exception/PromptExceptionType";
import { Resonance } from "./Lavenza/Resonance/Resonance";
import { Resonator } from "./Lavenza/Resonance/Resonator/Resonator";
import { Catalogue } from "./Lavenza/Service/Catalogue/Catalogue";
import { EventSubscriber } from "./Lavenza/Service/EventSubscriber/EventSubscriber";
import { DirectoryLoader } from "./Lavenza/Service/Loader/DirectoryLoader";
import { FileLoader } from "./Lavenza/Service/Loader/FileLoader";
import { Loader } from "./Lavenza/Service/Loader/Loader";
import { PluginSeeker } from "./Lavenza/Service/PluginSeeker/PluginSeeker";
import { Service } from "./Lavenza/Service/Service";
import { ServiceContainer } from "./Lavenza/Service/ServiceContainer";
import { Talent } from "./Lavenza/Talent/Talent";
import { TalentManager } from "./Lavenza/Talent/TalentManager";

// Load Environment Variables from .env file at the root of the project.
DotEnv.config();

// Configure colors for console.
// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
Colors.setTheme({
  data: "grey",
  debug: "blue",
  error: "red",
  help: "cyan",
  input: "grey",
  prompt: "grey",
  silly: "rainbow",
  status: "blue",
  success: "cyan",
  verbose: "cyan",
  warning: "yellow",
});

// Define the Heart of the module.
// This is the object that is later set as a global.
module.exports = {

  // Lavenza's core.
  // This class is the main handler of the application.
  // There is a clear defined order as to how things are ran in the application. The Core properly outlines this order.
  Core,

  // Confidants.
  // Re-usable functionality is managed in what I'm calling Confidants for this project. Shoutouts to Persona 5!
  // Each confidant has a specific use. See each of their files for more deets.
  // Adding them here for ease of access in other applications.
  Akechi,
  Igor,
  Kawakami,
  Morgana,
  Sojiro,
  Yoshida,

  // Managers.
  // These classes will manage big parts of the application that are integral.
  BotManager,
  TalentManager,

  // Services.
  Catalogue,
  DirectoryLoader,
  EventSubscriber,
  FileLoader,
  Gestalt,
  Loader,
  PluginSeeker,
  Resonator,
  ServiceContainer,

  // Classes & Models.
  // These are classes that are extended or used across the application. We import them here once.
  // They are linked in the global variable for easy access to outside applications.
  Command,
  CommandClientHandler,
  PromptException,
  Resonance,
  Service,
  Talent,

  // Enums.
  ClientType,
  PromptExceptionType,

  // Utility functions.
  __: Yoshida.translate,
  initialize: Core.initialize,
  personalize: Yoshida.personalize,
  service: Core.service,
  summon: Core.summon,
  translate: Yoshida.translate,
};
