/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Command } from "../talents/commander/src/Command/Command";
import { CommandClientHandler } from "../talents/commander/src/Command/CommandClientHandler";
import { Instruction } from "../talents/commander/src/Instruction/Instruction";
import { CommandCatalogue } from "../talents/commander/src/Service/CommandCatalogue";
import { CommandComposer } from "../talents/commander/src/Service/CommandComposer";
import { CommandDirectoryLoader } from "../talents/commander/src/Service/CommandDirectoryLoader";
import { CommandManager } from "../talents/commander/src/Service/CommandManager";
import { CommandPluginSeeker } from "../talents/commander/src/Service/CommandPluginSeeker";
import { Listener } from "../talents/listeners/src/Listener/Listener";
import { ListenerCatalogue } from "../talents/listeners/src/Service/ListenerCatalogue";
import { ListenerFileLoader } from "../talents/listeners/src/Service/ListenerFileLoader";
import { ListenerManager } from "../talents/listeners/src/Service/ListenerManager";
import { ListenerPluginSeeker } from "../talents/listeners/src/Service/ListenerPluginSeeker";
import { ListenerResonator } from "../talents/listeners/src/Service/ListenerResonator";

import { Bot } from "./Lavenza/Bot/Bot";
import { BotCatalogue } from "./Lavenza/Bot/BotCatalogue";
import { BotDirectoryLoader } from "./Lavenza/Bot/BotDirectoryLoader";
import { BotManager } from "./Lavenza/Bot/BotManager";
import { Client } from "./Lavenza/Client/Client";
import { ClientType } from "./Lavenza/Client/ClientType";
import { DiscordPrompt } from "./Lavenza/Client/Discord/DiscordPrompt";
import { DiscordResonance } from "./Lavenza/Client/Discord/DiscordResonance";
import { TwitchPrompt } from "./Lavenza/Client/Twitch/TwitchPrompt";
import { TwitchResonance } from "./Lavenza/Client/Twitch/TwitchResonance";
import { Akechi } from "./Lavenza/Confidant/Akechi";
import { Igor } from "./Lavenza/Confidant/Igor";
import { Kawakami } from "./Lavenza/Confidant/Kawakami";
import { Morgana } from "./Lavenza/Confidant/Morgana";
import { Sojiro } from "./Lavenza/Confidant/Sojiro";
import { Yoshida } from "./Lavenza/Confidant/Yoshida";
import { Core } from "./Lavenza/Core/Core";
import { CoreStatus } from "./Lavenza/Core/CoreStatus";
import { Eminence } from "./Lavenza/Eminence/Eminence";
import { Composer } from "./Lavenza/Gestalt/Composer/Composer";
import { Gestalt } from "./Lavenza/Gestalt/Gestalt";
import { GestaltComposer } from "./Lavenza/Gestalt/GestaltComposer";
import { GestaltEventSubscriber } from "./Lavenza/Gestalt/GestaltEventSubscriber";
import { StorageService } from "./Lavenza/Gestalt/StorageService/StorageService";
import { PromptException } from "./Lavenza/Prompt/Exception/PromptException";
import { PromptExceptionType } from "./Lavenza/Prompt/Exception/PromptExceptionType";
import { Prompt } from "./Lavenza/Prompt/Prompt";
import { PromptResonator } from "./Lavenza/Prompt/PromptResonator";
import { Resonance } from "./Lavenza/Resonance/Resonance";
import { ResonanceEventSubscriber } from "./Lavenza/Resonance/ResonanceEventSubscriber";
import { Resonator } from "./Lavenza/Resonance/Resonator/Resonator";
import { Catalogue } from "./Lavenza/Service/Catalogue/Catalogue";
import { EventSubscriber } from "./Lavenza/Service/EventSubscriber/EventSubscriber";
import { EventSubscriberManager } from "./Lavenza/Service/EventSubscriber/EventSubscriberManager";
import { SubscriptionRecordCatalogue } from "./Lavenza/Service/EventSubscriber/SubscriptionRecordCatalogue";
import { DirectoryLoader } from "./Lavenza/Service/Loader/DirectoryLoader";
import { FileLoader } from "./Lavenza/Service/Loader/FileLoader";
import { Loader } from "./Lavenza/Service/Loader/Loader";
import { PluginSeeker } from "./Lavenza/Service/PluginSeeker/PluginSeeker";
import { PluginSeekerManager } from "./Lavenza/Service/PluginSeeker/PluginSeekerManager";
import { RuntimeProcessId } from "./Lavenza/Service/RuntimeProcessId";
import { Service } from "./Lavenza/Service/Service";
import { ServiceContainer } from "./Lavenza/Service/ServiceContainer";
import { Talent } from "./Lavenza/Talent/Talent";
import { TalentCatalogue } from "./Lavenza/Talent/TalentCatalogue";
import { TalentDirectoryLoader } from "./Lavenza/Talent/TalentDirectoryLoader";
import { TalentManager } from "./Lavenza/Talent/TalentManager";

// Define the module's exports.
module.exports = {
  // Lavenza's core.
  // This class is the main handler of the application.
  // There is a clear defined order as to how things are ran in the application. The Core properly outlines this order.
  Core,
  ServiceContainer,

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

  // Services.
  BotCatalogue,
  BotDirectoryLoader,
  BotManager,
  CommandCatalogue,
  CommandComposer,
  CommandDirectoryLoader,
  CommandManager,
  CommandPluginSeeker,
  DirectoryLoader,
  EventSubscriberManager,
  FileLoader,
  Gestalt,
  GestaltComposer,
  GestaltEventSubscriber,
  ListenerCatalogue,
  ListenerFileLoader,
  ListenerManager,
  ListenerPluginSeeker,
  ListenerResonator,
  PluginSeekerManager,
  PromptResonator,
  ResonanceEventSubscriber,
  SubscriptionRecordCatalogue,
  TalentCatalogue,
  TalentDirectoryLoader,
  TalentManager,

  // Classes & Models.
  // These are classes that are extended or used across the application. We import them here once.
  // They are linked in the global variable for easy access to outside applications.
  Bot,
  Catalogue,
  Client,
  Command,
  CommandClientHandler,
  Composer,
  DiscordPrompt,
  DiscordResonance,
  EventSubscriber,
  Instruction,
  Listener,
  Loader,
  PluginSeeker,
  Prompt,
  PromptException,
  Resonance,
  Resonator,
  Service,
  StorageService,
  Talent,
  TwitchPrompt,
  TwitchResonance,

  // Enums.
  ClientType,
  CoreStatus,
  Eminence,
  PromptExceptionType,
  RuntimeProcessId,

  // Utility functions.
  __: Yoshida.translate,
  initialize: Core.initialize,
  personalize: Yoshida.personalize,
  service: Core.service,
  summon: Core.summon,
  translate: Yoshida.translate,
};
