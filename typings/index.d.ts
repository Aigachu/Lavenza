/* tslint:disable:completed-docs only-arrow-functions max-classes-per-file no-any file-name-casing */
import { BotManager } from "../core/lib/Lavenza/Bot/BotManager";
import { Gestalt } from "../core/lib/Lavenza/Gestalt/Gestalt";
import { Service } from "../core/lib/Lavenza/Service/Service";
import { ServiceType } from "../core/lib/Lavenza/Service/ServiceType";
import { TalentManager } from "../core/lib/Lavenza/Talent/TalentManager";

/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
declare module "lavenza" {
  // === Imports ===
  import Timeout = NodeJS.Timeout;
  import { Translate } from "@google-cloud/translate";
  import { EventEmitter } from "events";

  // === Classes ===
  export class Core {
    public static paths: {
      bots: string;
      database: string;
      root: string;
      talents: {
        core: string;
        custom: string;
      };
    };
    public static settings: CoreSettings;
    public static status: CoreStatus;
    private static version: string;
    public static async initialize(root: string): Promise<Core>;
    public static async summon(): Promise<void>;
    public static service<S extends Service>(id: ServiceType<S> | string): S;
    public static gestalt(): Gestalt;
    public static botManager(): BotManager;
    public static talentManager(): TalentManager;
    private static setPaths(rootPath: string): Promise<void>;
  }

  export class Akechi {
    public static createDirectory(directoryPath: string): Promise<void>;
    public static copyFiles(source: string, destination: string): Promise<void>;
    public static directoryExists(directoryPath: string): Promise<boolean>;
    public static fileExists(filePath: string): Promise<boolean>;
    public static readFile(filePath: string): Promise<Buffer>;
    public static readYamlFile(filePath: string): Promise<{}>;
    public static writeYamlFile(filePath: string, output: {}): Promise<void>;
    public static getDirectoriesFrom(directoryPath: string): Promise<string[] | undefined>;
    public static getFilesFrom(source: string, dirs?: boolean): Promise<string[] | undefined>;
    public static isDirectory(source: string): boolean;
  }

  export class Igor {
    public static pocket(error: Error): Promise<void>;
    public static continue(error: Error): Promise<boolean>;
    public static stop(error: Error): Promise<void>;
    public static throw(error: Error | string, replacers: {}, locale: string): Promise<void>;
  }

  export class Kawakami {
    public static bold(text: string | number): string;
    public static italics(text: string): string;
    public static code(text: string, language?: string): string;
  }

  export class Morgana {
    public static log(message: string, replacers?: {}, type?: string, locale?: string): Promise<void>;
    public static success(message: string, replacers?: {}): Promise<void>;
    public static status(message: string, replacers?: {}): Promise<void>;
    public static warn(message: string, replacers?: {}): Promise<void>;
    public static error(message: string, replacers?: {}): Promise<void>;
  }

  export class Sojiro {
    public static isConfirmation(text: string): Promise<boolean>;
    public static findWordMatch(word: string, haystack: string): Promise<boolean>;
    public static getRandomElementFromArray(array: unknown[]): unknown;
    public static removeFromArray(array: unknown[], element: unknown): unknown[];
    public static isEmpty(variable: unknown): boolean;
    public static wait(seconds: number): Promise<void>;
  }

  export class Yoshida {
    private static googleTranslate: Translate;
    private static translationInitialized: boolean;
    public static initializeI18N(): Promise<void>;
    public static parseI18NParams(parameters: unknown[]): Promise<AbstractObject>;
    public static personalize(defaultText: string, tag: string, bot: Bot): Promise<string>;
    public static translate(...parameters: unknown[]): Promise<string>;
    private static getPersonalization(defaultText: string, tag: string, bot: Bot): Promise<string>;
  }

  abstract class Manager<T> {
    protected repository: T[];
    public build(): Promise<void>;
    public arrange(): Promise<void>;
    public run(): Promise<void>;
    public all(): Promise<T[]>;
    public find(predicate: (item: T) => {}): T;
    public retrieve(predicate: (item: T) => {}): T[];
    public push(item: T): Promise<void>;
    public pop(item: unknown): Promise<void>;
  }

  export class BotManager extends Manager {
    private ignoredBots: {};
    public build(): Promise<void>;
    public getBot(id: string): Promise<Bot>;
    public run(): Promise<void>;
    public bootMasterBot(): Promise<void>;
    public boot(botId: string): Promise<void>;
    public shutdown(botId: string): Promise<void>;
    public buldBot(botId: string): Promise<void>;
    public buildAllBots(): Promise<void>;
    private bootAutoBoots(): Promise<void>;
    private registerBot(botId: string, directory?: string): Promise<void>;
    private registerAllBotsInDirectory(): Promise<void>;
  }

  export class TalentManager extends Manager {
    public build(): Promise<void>;
    public getTalent(machineName: string): Promise<Talent>;
    public loadTalent(name: string): Promise<void>;
    private getTalentPath(name: string): Promise<string | undefined>;
  }

  export class Gestalt {
    private storageService: StorageService;
    public bootstrap(): Promise<void>;
    public build(): Promise<void>;
    public createCollection(endpoint: string, payload: {}): Promise<void>;
    public delete(endpoint: string): Promise<void>;
    public get(endpoint: string): Promise<{}>;
    public post(endpoint: string, payload: {}): Promise<{} | undefined>;
    public request({protocol, endpoint, payload}: AbstractObject): Promise<{} | undefined>;
    public sync(config: {}, source: string): Promise<{}>;
    public update(endpoint: string, payload: {}): Promise<{} | undefined>;
  }

  abstract class StorageService {
    public abstract build(): Promise<void>;
    public abstract createCollection(endpoint: string, payload: {}): Promise<void>;
    public abstract delete(endpoint: string): Promise<void>;
    public abstract get(endpoint: string): Promise<{}>;
    public abstract post(endpoint: string, payload: {}): Promise<{} | undefined>;
    public request({protocol, endpoint, payload}: AbstractObject): Promise<{} | undefined>;
    public abstract update(endpoint: string, payload: {}): Promise<{} | undefined>;
  }

  export class Bot {
    public id: string;
    public env: BotEnvironmentVariables;
    public config: BotConfigurations;
    public directory: string;
    public clients: AssociativeObject<Client>;
    public enabledTalents: string[];
    public enabledCommands: string[];
    public listeners: Listener[];
    public prompts: Prompt[];
    public joker: Joker;
    public maintenance: boolean;
    public isMaster: boolean;
    public summoned: boolean;
    public constructor(id: string, config: BotConfigurations, directory: string);
    public build(): Promise<void>;
    public deploy(): Promise<void>;
    public shutdown(): Promise<void>;
    public getActiveConfig(): Promise<BotConfigurations>;
    public getClient(clientType: ClientType): Promise<Client>;
    public getClientConfig(clientType: ClientType): Promise<BotClientConfig>;
    public getActiveClientConfig(clientType: ClientType): Promise<BotClientConfig>;
    public removePrompt(prompt: Prompt): Promise<void>;
    public disconnectClients(): Promise<void>;
    public disconnectClient(clientType: ClientType): Promise<void>;
    public getCommandPrefix(resonance: Resonance): Promise<string>;
    private loadEnvironmentVariables(): Promise<void>;
    private setJoker(): Promise<void>;
    private setCommands(): Promise<void>;
    private setListeners(): Promise<void>;
    private authenticateClients(): Promise<void>;
    private initializeClients(): Promise<void>;
    private initializeTalentsForBot(): Promise<void>;
    private grantTalents(): Promise<void>;
    private validateTalents(): Promise<void>;
    private validateTalentDependencies(talentMachineName: string): Promise<void>;
  }

  export abstract class Client {
    public bot: Bot;
    public type: ClientType;
    public config: BotClientConfig;
    public abstract connector: unknown;
    protected constructor(bot: Bot, config: BotClientConfig);
    public resonate(message: unknown): Promise<void>;
    public authorize(command: Command, resonance: Resonance): Promise<boolean>;
    public prompt(
      user: ClientUser,
      line: unknown,
      resonance: Resonance,
      lifespan: number,
      onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
      onError?: (error: PromptException) => Promise<void>)
      : Promise<void>;
    public abstract bridge(): Promise<void>;
    public abstract build(): Promise<void>;
    public abstract authenticate(): Promise<void>;
    public abstract disconnect(): Promise<void>;
    public abstract gestalt(): Promise<void>;
    public abstract buildResonance(message: unknown): Promise<Resonance>;
    public abstract buildPrompt(
      user: unknown,
      line: unknown,
      resonance: Resonance,
      lifespan: number,
      onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
      onError?: (error: PromptException) => Promise<void>)
      : Promise<Prompt>;
    public abstract buildCommandAuthorizer(command: Command, resonance: Resonance): Promise<CommandAuthorizer>;
    public abstract help(command: Command, resonance: Resonance): Promise<void>;
    public abstract getUser(identifier: string): Promise<ClientUser>;
    public abstract getActiveConfigurations(): Promise<ClientConfigurations>;
    public abstract getCommandPrefix(resonance: Resonance): Promise<string>;
    public abstract typeFor(seconds: number, channel: unknown): Promise<void>;
  }

  export abstract class Command {
    public id: string;
    public key: string;
    public directory: string;
    public config: CommandConfigurations;
    protected talent: Talent;
    protected constructor(id: string, key: string, directory: string);
    public build(config: CommandConfigurations, talent: Talent): Promise<void>;
    public getActiveConfigForBot(bot: Bot): Promise<CommandConfigurations>;
    public getActiveClientConfig(clientType: ClientType, bot: Bot): Promise<CommandClientConfig>;
    public getClientConfig(clientType: ClientType): Promise<CommandClientConfig>;
    public getActiveParameterConfig(bot: Bot): Promise<CommandParameterConfig>;
    public getParameterConfig(): Promise<CommandParameterConfig>;
    public abstract execute(resonance: Resonance): Promise<void>;
    public fireClientHandlers(resonance: Resonance, data: AbstractObject | string, method?: string): Promise<unknown>;
    public help(resonance: Resonance): Promise<void>;
    public allowedInClient(clientType: ClientType): Promise<boolean>;
  }

  export class Talent {
    public nestedCommands: string[];
    public config: TalentConfigurations;
    public databases: AssociativeObject<string>;
    public directory: string;
    public listeners: Listener[];
    public machineName: string;
    public build(config: TalentConfigurations): Promise<void>;
    public getActiveConfigForBot(bot: Bot): Promise<TalentConfigurations>;
    public initialize(bot: Bot): Promise<void>;
  }

  export abstract class Resonance {
    public content: string;
    public message: ClientMessage;
    public bot: Bot;
    public client: Client;
    public instruction: Instruction;
    public author: ClientUser;
    public origin: unknown;
    public locale: string;
    public private: string;
    public channel: unknown;
    protected constructor(content: string, message: ClientMessage, bot: Bot, client: Client);
    public build(): Promise<void>;
    public setInstruction(instruction: Instruction): Promise<void>;
    public getCommand(): Promise<Command>;
    public getArguments(): Promise<AbstractObject>;
    public executeCommand(): Promise<void>;
    public executeHelp(): Promise<void>;
    public isPrivate(): Promise<boolean>;
    public prompt(
      user: ClientUser,
      line: unknown,
      lifespan: number,
      onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
      onError?: (error: PromptException) => Promise<void>)
      : Promise<void>;
    public reply(content: string, personalizationTag: string): Promise<unknown>;
    public __reply(...parameters: unknown[]): Promise<unknown>;
    public send(destination: unknown, content: string, personalizationTag: string): Promise<unknown>;
    public __send(destination: unknown, ...parameters: unknown[]): Promise<unknown>;
    public abstract typeFor(seconds: number, destination: unknown): Promise<void>;
    protected abstract doSend(bot: Bot, destination: unknown, content: string): Promise<unknown>;
    protected abstract getLocale(): Promise<string>;
    protected abstract resolveOrigin(): Promise<unknown>;
    protected abstract resolvePrivacy(): Promise<string>;
  }

  export abstract class Listener {
    protected talent: Talent;
    public build(talent: Talent): Promise<void>;
    public abstract listen(resonance: Resonance): Promise<void>;
  }

  export abstract class Prompt {
    public user: ClientUser;
    public line: unknown;
    public resonance: Resonance;
    public lifespan: number;
    public requester: unknown;
    public onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>;
    public onError: (error: Error) => Promise<void>;
    public bot: Bot;
    public ee: EventEmitter;
    public timer: Timeout;
    public resetCount: number;
    protected constructor(
      user: ClientUser,
      line: unknown,
      resonance: Resonance,
      lifespan: number,
      onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
      onError: (error: PromptException) => Promise<void>,
      bot: Bot,
    );
    public listen(resonance: Resonance): Promise<void>;
    public await(): Promise<void>;
    public reset({error}: AbstractObject): Promise<void>;
    public disable(): Promise<void>;
    public error(type: PromptExceptionType): Promise<void>;
    protected abstract condition(resonance: Resonance): Promise<boolean>;
    private clearTimer(): Promise<void>;
    private clearListeners(): Promise<void>;
  }

  export class PromptException {
    public readonly type: PromptExceptionType;
    public constructor(type: PromptExceptionType, message: string);
    public toString(): string;
  }

  export abstract class CommandAuthorizer {
    protected resonance: Resonance;
    protected readonly bot: Bot;
    protected readonly type: ClientType;
    protected configurations: CommandAuthorizerConfigurationsCollection;
    protected command: Command;
    protected authorID: string;
    protected constructor(command: Command, resonance: Resonance);
    public build(): Promise<void>;
    public authorize(): Promise<boolean>;
    protected abstract warrant(): Promise<boolean>;
    protected abstract getAuthorIdentification(): Promise<string>;
    protected abstract getAuthorEminence(): Promise<Eminence>;
    protected abstract sendCooldownNotification(): Promise<void>;
    private validateActivation(): Promise<boolean>;
    private validatePrivacy(): Promise<boolean>;
    private validateUser(): Promise<boolean>;
    private validateEminence(requiredEminenceKey?: Eminence | string): Promise<boolean>;
    private validateCommandArguments(): Promise<boolean>;
    private validateCooldown(): Promise<boolean>;
  }

  export abstract class CommandClientHandler {
    public command: Command;
    public resonance: Resonance;
    public directory: string;
    protected constructor(command: Command, resonance: Resonance, directory: string);
    public abstract execute(data: unknown): Promise<unknown>;
  }

  // === Enumerations ===
  enum Eminence {
    None,
    Aficionado,
    Confidant,
    Thief,
    Joker,
  }

  enum ClientType {
    Discord = "discord",
    Twitch = "twitch",
  }

  enum PromptExceptionType {
    NO_RESPONSE = "no-response",
    INVALID_RESPONSE = "invalid-response",
    MISC = "miscellaneous",
    MAX_RESET_EXCEEDED = "max-reset-exceeded",
  }

  enum CoreStatus {
    sleep = "asleep",
    genesis = "genesis",
    synthesis = "synthesis",
    statis = "statis",
    symbiosis = "symbiosis",
    running = "running",
    maintenance = "maintenance",
  }

  // === Interfaces (Types) ===
  interface CoreSettings {
    root: string;
    locale: CoreLocaleSettings;
    config: CoreConfigurationsSettings;
    services: CoreServiceSettings;
  }

  interface CoreLocaleSettings {
    default: string;
  }

  interface CoreConfigurationsSettings {
    bots: CoreBotSettings;
  }

  interface CoreBotSettings {
    master: string;
    autoboot: string[];
  }

  interface CoreServiceSettings {
    google: CoreGoogleServiceSettings;
  }

  interface CoreGoogleServiceSettings {
    translate: CoreGoogleServiceTranslateSettings;
  }

  interface CoreGoogleServiceTranslateSettings {
    enabled: boolean;
    projectId: string;
  }

  type Joker = {
    [key in ClientType]: ClientUser;
  };

  interface AbstractObject {
    [key: string]: any;
  }

  interface AssociativeObject<T> {
    [key: string]: T;
  }

  interface ClientUser {
    id: string;
    username: string;
  }

  interface ClientMessage {
    channel: ClientChannel;
    author: ClientUser;
  }

  interface ClientChannel {
    id: string;
  }

  interface BotConfigurations {
    name: string;
    active: boolean;
    directory: string;
    commandPrefix: string;
    locale: string;
    talents: string[];
    clients: string[];
  }

  interface BotEnvironmentVariables {
    DISCORD_TOKEN: string;
    DISCORD_CLIENT_ID: string;
    TWITCH_OAUTH_TOKEN: string;
    TWITCH_CLIENT_ID: string;
    CLEVER_BOT_API_KEY: string;
  }

  interface TalentConfigurations {
    class: string;
    clients: string[] | string;
    dependencies: string[];
    description: string;
    directory: string;
    name: string;
    version: string;
  }

  interface Instruction {
    arguments: AbstractObject;
    command: Command;
    config: InstructionCommandConfig;
    content: string;
  }

  interface InstructionCommandConfig {
    base: CommandConfigurations;
    client: CommandClientConfig;
  }

  // tslint:disable-next-line:no-empty-interface
  interface ClientConfigurations {

  }

  interface BotClientConfig {
    joker: string;
    commandPrefix: string;
    userEminences: AssociativeObject<string>;
  }

  interface CommandClientConfig {
    authorization: CommandClientAuthorizationConfig;
    cooldown: CommandCooldownConfig;
  }

  interface CommandAuthorizerConfigurationsCollection {
    bot: CommandAuthorizerBotConfigurations;
    command: CommandAuthorizerCommandConfigurations;
    client: ClientConfigurations;
  }

  interface CommandAuthorizerBotConfigurations {
    base: BotConfigurations;
    client: BotClientConfig;
  }

  interface CommandAuthorizerCommandConfigurations {
    base: CommandConfigurations;
    client: CommandClientConfig;
    parameters: CommandParameterConfig;
  }

  interface CommandConfigurations {
    name: string;
    active: boolean;
    description: string;
    class: string;
    key: string;
    aliases: string[];
    authorization: CommandAuthorizationConfig;
    cooldown: CommandCooldownConfig;
    clients: string | string[];
    directory: string;

  }

  interface CommandParameterConfig {
    input: any;
    options: any;
    flags: any;
  }

  interface CommandCooldownConfig {
    user: number;
    global: number;
  }

  interface CommandAuthorizationConfig {
    enabledInDirectMessages: boolean;
    accessEminence: number;
  }

  interface CommandClientAuthorizationConfig extends CommandAuthorizationConfig {
    blacklist: CommandClientAuthorizationListConfig;
    whitelist: CommandClientAuthorizationListConfig;
  }

  /**
   * Declares an interface schema for authorization lists in Commands.
   */
  interface CommandClientAuthorizationListConfig {
    users: string[];
  }

  // === Functions ===
  export function initialize(root?: string): Promise<Core>;
  export function summon(): Promise<void>;
  export function personalize(defaultText: string, tag: string, bot: Bot): Promise<string>;
  export function __(...parameters: unknown[]): Promise<string>;
  export function translate(...parameters: unknown[]): Promise<string>;
}

