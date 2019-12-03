/* tslint:disable:completed-docs only-arrow-functions max-classes-per-file no-any file-name-casing */
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
declare module "lavenza" {
  /**
   * ***********************
   * ******* Imports *******
   * ***********************
   */
  import Timeout = NodeJS.Timeout;
  import { Translate } from "@google-cloud/translate";
  import { Channel, Client as DiscordJSClient, DMChannel, GroupDMChannel, Guild, Message, TextChannel, User } from "discord.js";
  import { EventEmitter } from "events";
  import * as tmi from "tmi.js";

  /**
   * ***********************
   * ******* Exports *******
   * ***********************
   */
    // === Core ===
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
    public static initialize(root?: string): Promise<Core>;
    public static summon(): Promise<void>;
    public static service<S extends Service>(id: ServiceType<S> | string): S;
    public static gestalt(): Gestalt;
    public static botManager(): BotManager;
    public static talentManager(): TalentManager;
    private static setPaths(rootPath: string): Promise<void>;
  }

  export class ServiceContainer {
    public static services: Service[];
    public static runtimeTasks: AssociativeObject<RuntimeTask[]>;
    public static get<S extends Service>(id: ServiceType<S> | string): S;
    public static getServicesWithTag(tag: string): Service[];
    public static serviceExists(id: string): boolean;
    public static load(definitionFilePath: string, talent?: string): Promise<void>;
    public static tasks(process: RuntimeProcessId): Promise<void>;
    private static prioritySort(a: RuntimeTask, b: RuntimeTask): number;
  }

  // === Confidants ===
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
    public static throw(error: Error | string, replacers?: {}, locale?: string): Promise<void>;
    public static exit(error: Error | string, replacers?: {}, locale?: string): Promise<void>;
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
    public static wonderful(message: string, replacers?: {}): Promise<void>;
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

  // === Services ===
  export class BotCatalogue extends Catalogue<Bot> {
    public genesis(): Promise<void>;
    public allSummoned(): Bot[];
    public getBot(id: string): Bot;
  }

  export class BotDirectoryLoader extends DirectoryLoader<Bot> {
    public process(botDirectoryPath: string): Promise<Bot>;
  }

  export class BotManager extends Service {
    public static summon(id: string): Promise<void>;
    public static shutdown(id: string): Promise<void>;
    private static summonAutoBoots(): Promise<void>;
    public synthesis(): Promise<void>;
    public statis(): Promise<void>;
  }

  export class CommandCatalogue extends Catalogue<Command> {
    public storeCommandsForEntity(commands: Command[], entity: Bot | Talent): Promise<void>;
    public getCommandsForEntity(entity: Bot | Talent): Promise<Command[]>;
  }

  export class CommandComposer extends Composer {
    public priority: number;
    public compose(): Promise<void>;
    public getActiveCommandConfigForBot(command: Command, bot: Bot): Promise<CommandConfigurations>;
    public getActiveCommandClientConfigForBot(command: Command, clientType: ClientType, bot: Bot): Promise<CommandClientConfig>;
    public getCommandClientConfig(command: Command, clientType: ClientType): Promise<CommandClientConfig>;
    public getActiveParameterConfigForBot(command: Command, bot: Bot): Promise<CommandParameterConfig>;
    public getCommandParameterConfig(command: Command): Promise<CommandParameterConfig>;
  }

  export class CommandDirectoryLoader extends DirectoryLoader<Command> {
    public process(commandDirectoryPath: string): Promise<Command>;
  }

  export class CommandManager extends Service {
    public synthesis(): Promise<void>;
  }

  export class CommandPluginSeeker extends PluginSeeker<Command> {
    protected path: string;
    protected loader: string;
    protected plug(plugins: Command[], entity: Bot | Talent): Promise<void>;
  }

  export abstract class DirectoryLoader<T> extends Loader<T> {
    public load(root: string): Promise<T[]>;
  }

  export class EventSubscriberManager extends Service {
    public static runEventSubscribers(client: Client, event: string, data?: AbstractObject): Promise<void>;
    public static synthesizeEventSubscribers(): Promise<void>;
    public synthesis(): Promise<void>;
  }

  export abstract class FileLoader<T> extends Loader<T> {
    protected abstract fileType: string;
    public load(root: string): Promise<T[]>;
  }

  export class FunctionalResonator extends Resonator {
    public priority: number = 4500;
    public resonate(resonance: Resonance): Promise<void>;
  }

  export class Gestalt {
    private storageService: StorageService;
    public genesis(): Promise<void>;
    public statis(): Promise<void>;
    public createCollection(endpoint: string, payload: {}): Promise<void>;
    public delete(endpoint: string): Promise<void>;
    public get(endpoint: string): Promise<{}>;
    public post(endpoint: string, payload: {}): Promise<{} | undefined>;
    public request({protocol, endpoint, payload}: AbstractObject): Promise<{} | undefined>;
    public sync(config: {}, source: string): Promise<{}>;
    public update(endpoint: string, payload: {}): Promise<{} | undefined>;
  }

  export class GestaltComposer extends Composer {
    public priority: number;
    public compose(): Promise<void>;
    public getActiveConfigForBot(bot: Bot): Promise<BotConfigurations>;
    public getActiveClientConfigForBot(bot: Bot, clientType: ClientType): Promise<BotClientConfig>;
    public getActiveConfigForClient(client: Client): Promise<ClientConfigurations>;
    public getActiveTalentConfigForBot(talent: Talent, bot: Bot): Promise<TalentConfigurations>;
  }

  export class GestaltEventSubscriber extends EventSubscriber {
    public gestaltService: Gestalt;
    public build(): Promise<void>;
    public getEventSubcriptions(): EventSubscriptions;
    public discordOnGuildCreate(client: DiscordClient, {guild}: {guild: Guild}): Promise<void>;
  }

  export class ListenerCatalogue extends Catalogue<Listener> {
    public storeListenersForEntity(listeners: Listener[], entity: Bot | Talent): Promise<void>;
    public getListenersForEntity(entity: Bot | Talent): Promise<Listener[]>;
  }

  export class ListenerFileLoader extends FileLoader<Listener> {
    protected fileType: string;
    public process(listenerFilePath: string): Promise<Listener>;
  }

  export class ListenerManager extends Service {
    public synthesis(): Promise<void>;
  }

  export class ListenerPluginSeeker extends PluginSeeker<Listener> {
    protected path: string;
    protected loader: string;
    protected plug(plugins: Listener[], entity: Bot | Talent): Promise<void>;
  }

  export class ListenerResonator extends Resonator {
    public abstract priority: number;
    public resonate(resonance: Resonance): Promise<void>;
  }

  export class PluginSeekerManager extends Service {
    public static seekPlugins(): Promise<void>;
    public genesis(): Promise<void>;
  }

  export class PromptResonator extends Resonator {
    public priority: number;
    public resonate(resonance: Resonance): Promise<void>;
  }

  export class ResonanceEventSubscriber extends EventSubscriber {
    public getEventSubcriptions(): EventSubscriptions;
    public resonate(client: Client, {message}: {message: ClientMessage}): Promise<void>;
  }

  export class SubscriptionRecordCatalogue extends Catalogue<SubscriptionRecord> {}

  export class TalentCatalogue extends Catalogue<Talent> {
    public genesis(): Promise<void>;
    public getTalentsForBot(bot: Bot): Promise<Talent[]>;
    public assignTalentToBot(talent: Talent, bot: Bot): Promise<void>;
    public getTalent(machineName: string): Talent;
  }

  export class TalentDirectoryLoader extends DirectoryLoader<Talent> {
    public process(talentDirectoryPath: string): Promise<Talent>;
  }

  export class TalentManager extends Service {
    public static validateTalentDependencies(talent: Talent, bot: Bot): Promise<boolean>;
    private static initializeTalentsForBot(bot: Bot): Promise<void>;
    private static grantTalentsToBot(bot: Bot): Promise<void>;
    public genesis(): Promise<void>;
    public statis(): Promise<void>;
  }

  // === Classes & Models ===
  export class Bot {
    public id: string;
    public env: BotEnvironmentVariables;
    public config: BotConfigurations;
    public directory: string;
    public clients: AssociativeObject<Client>;
    public prompts: Prompt[];
    public joker: Joker;
    public maintenance: boolean;
    public isMaster: boolean;
    public summoned: boolean;
    public constructor(id: string, config: BotConfigurations, directory: string);
    public synthesis(): Promise<void>;
    public summon(): Promise<void>;
    public shutdown(): Promise<void>;
    public getClient(clientType: ClientType): Promise<Client>;
    public getClientConfig(clientType: ClientType | string): Promise<BotClientConfig>;
    public removePrompt(prompt: Prompt): Promise<void>;
    public disconnectClients(): Promise<void>;
    public disconnectClient(clientType: ClientType): Promise<void>;
    private loadEnvironmentVariables(): Promise<void>;
    private setJoker(): Promise<void>;
    private authenticateClients(): Promise<void>;
    private initializeClients(): Promise<void>;
  }

  export abstract class Catalogue<T> extends Service {
    protected repository: T[];
    protected libraries: Map<string, T[]>;
    public all(): T[];
    public library(id: string): T[];
    public find(predicate: (item: T) => {}, library?: string): T;
    public retrieve(predicate: (item: T) => {}, library?: string): T[];
    public assign(payload: T | T[], library: string): Promise<void>;
    public unassign(item: T, library: string): Promise<void>;
    public store(payload: T | T[], library?: string): Promise<void>;
    public pop(item: T, library?: string): Promise<void>;
  }

  export abstract class Client {
    public bot: Bot;
    public type: ClientType;
    public config: BotClientConfig;
    public abstract connector: unknown;
    protected constructor(bot: Bot, config: BotClientConfig);
    public abstract bridge(): Promise<void>;
    public abstract build(): Promise<void>;
    public abstract authenticate(): Promise<void>;
    public abstract disconnect(): Promise<void>;
    public abstract gestalt(): Promise<void>;
    public abstract getUser(identifier: string): Promise<ClientUser>;
    public abstract typeFor(seconds: number, channel: unknown): Promise<void>;
  }

  export abstract class Command {
    public id: string;
    public key: string;
    public directory: string;
    public config: CommandConfigurations;
    public aliases: string[];
    protected talent: Talent;
    protected constructor(id: string, key: string, directory: string);
    public build(config: CommandConfigurations, talent: Talent): Promise<void>;
    public abstract execute(instruction: Instruction, resonance: Resonance): Promise<void>;
    public fireClientHandlers(resonance: Resonance, data: AbstractObject | string, method?: string): Promise<unknown>;
    public help(resonance: Resonance): Promise<void>;
    public allowedInClient(clientType: ClientType): Promise<boolean>;
  }

  export abstract class CommandClientHandler {
    public command: Command;
    public resonance: Resonance;
    public directory: string;
    protected constructor(command: Command, resonance: Resonance, directory: string);
    public abstract execute(data: unknown): Promise<unknown>;
  }

  export abstract class Composer extends Service {
    public tags: string[];
    public abstract priority: number;
    public gestaltService: Gestalt;
    public build(): Promise<void>;
    public abstract compose(): Promise<void>;
  }

  export class DiscordPrompt extends Prompt {
    public resonance: DiscordResonance;
    public user: User;
    public channel: TextChannel | DMChannel | GroupDMChannel | User;
    protected condition(resonance: DiscordResonance): Promise<boolean>;
  }

  export class DiscordResonance extends Resonance {
    public message: Message;
    public client: DiscordClient;
    public author: User;
    public channel: TextChannel | DMChannel | GroupDMChannel | User;
    public origin: TextChannel | DMChannel | GroupDMChannel | User;
    public guild: Guild;
    public constructor(content: string, message: Message, bot: Bot, client: Client);
    public getLocale(): Promise<string>;
    public resolveOrigin(): Promise<Channel>;
    public resolvePrivacy(): Promise<string>;
    public typeFor(seconds: number, destination: TextChannel | DMChannel | GroupDMChannel | User): Promise<void>;
    protected doSend(bot: Bot, destination: TextChannel, content: string): Promise<Message | Message[]>;
  }

  export abstract class EventSubscriber extends Service {
    public tags: string[];
    public abstract getEventSubcriptions(): EventSubscriptions;
  }

  export class Instruction {
    public resonance: Resonance;
    public prefix: string;
    public arguments: AbstractObject;
    public command: Command;
    public config: InstructionCommandConfig;
    public content: string;
    public constructor(resonance: Resonance, command: Command, prefix: string, config: InstructionCommandConfig, args: AbstractObject, content: string);
  }

  export abstract class Listener {
    protected talent: Talent;
    public build(): Promise<void>;
    public abstract listen(resonance: Resonance): Promise<void>;
  }

  export abstract class Loader<T> extends Service {
    public abstract load(root: string): Promise<T[]>;
    public abstract process(itemPath: string): Promise<T>;
  }

  export abstract class PluginSeeker<T> extends Service {
    public tags: string[];
    protected abstract path: string;
    protected abstract loader: string;
    public seek(): Promise<void>;
    protected abstract plug(plugins: T[], entity: Bot | Talent): Promise<void>;
  }

  export abstract class Prompt {
    public type: PromptType;
    public resonance: Resonance;
    public bot: Bot;
    public message: string;
    public clientType: ClientType;
    public user: ClientUser;
    public channel: ClientChannel;
    public timeLimit: number;
    public onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>;
    public onError: (error: Error) => Promise<void>;
    public ee: EventEmitter;
    public timer: Timeout;
    public resetCount: number;
    protected constructor(promptInfo: PromptInfo);
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

  export abstract class Resonance {
    public content: string;
    public message: ClientMessage;
    public bot: Bot;
    public client: Client;
    public author: ClientUser;
    public channel: ClientChannel;
    public origin: unknown;
    public locale: string;
    public private: string;
    protected constructor(content: string, message: ClientMessage, bot: Bot, client: Client);
    public build(): Promise<void>;
    public isPrivate(): Promise<boolean>;
    public prompt(promptInfo: PromptInfo): Promise<string | AbstractObject>;
    public reply(content: string, personalizationTag?: string): Promise<unknown>;
    public __reply(...parameters: unknown[]): Promise<unknown>;
    public send(destination: unknown, content: string, personalizationTag?: string): Promise<unknown>;
    public __send(destination: unknown, ...parameters: unknown[]): Promise<unknown>;
    public abstract typeFor(seconds: number, destination: unknown): Promise<void>;
    protected abstract doSend(bot: Bot, destination: unknown, content: string): Promise<unknown>;
    protected abstract getLocale(): Promise<string>;
    protected abstract resolveOrigin(): Promise<unknown>;
    protected abstract resolvePrivacy(): Promise<string>;
  }

  export abstract class Resonator extends Service {
    public tags: string[];
    public abstract priority: number;
    public abstract resonate(resonance: Resonance): Promise<void>;
  }

  export abstract class Service implements ServiceInterface {
    public id: string;
    public dependencies: string[];
    public tags: string[];
    public talent: string;
    public constructor(id: string, dependencies?: string[], tags?: string[], talent?: string);
    public build(): Promise<void>;
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

  export class Talent {
    public config: TalentConfigurations;
    public databases: AssociativeObject<string>;
    public directory: string;
    public machineName: string;
    public loaded: boolean;
    public resonate(resonance: Resonance): Promise<void>;
    public build(config: TalentConfigurations): Promise<void>;
    public initialize(bot: Bot): Promise<void>;
    public load(): Promise<void>;
  }

  export class TwitchPrompt extends Prompt {
    public resonance: TwitchResonance;
    public user: TwitchUser;
    public channel: TwitchChannel;
    protected condition(resonance: TwitchResonance): Promise<boolean>;
  }

  export class TwitchResonance extends Resonance {
    public message: TwitchMessage;
    public client: TwitchClient;
    public author: TwitchUser;
    public channel: TwitchChannel;
    public origin: TwitchChannel;
    public constructor(content: string, message: TwitchMessage, bot: Bot, client: TwitchClient);
    public getLocale(): Promise<string>;
    public typeFor(seconds: number, destination?: string): Promise<void>;
    protected doSend(bot: Bot, destination: TwitchChannel | TwitchUser | string, content: string): Promise<string>;
    protected resolveOrigin(): Promise<TwitchChannel>;
    protected resolvePrivacy(): Promise<string>;
  }

  // === Enumerations ===
  enum ClientType {
    Discord = "discord",
    Twitch = "twitch",
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

  enum Eminence {
    None,
    Aficionado,
    Confidant,
    Thief,
    Joker,
  }

  enum PromptType {
    Text = "text",
  }

  enum PromptExceptionType {
    NO_RESPONSE = "no-response",
    INVALID_RESPONSE = "invalid-response",
    MISC = "miscellaneous",
    MAX_RESET_EXCEEDED = "max-reset-exceeded",
  }

  enum RuntimeProcessId {
    genesis = "genesis",
    synthesis = "synthesis",
    statis = "statis",
    symbiosis = "symbiosis",
  }

  /**
   * **********************************
   * ******* Types & Interfaces *******
   * **********************************
   */
  type ServiceType<S> = new (id: string, dependencies: string[], tags: string[], talent?: string) => S;

  type Joker = {
    [key in ClientType]: ClientUser;
  };

  type EventSubscriptions = {
    [key in ClientType]: AssociativeObject<EventSubscription>
  };

  // === Interfaces ===
  interface ServiceInterface {
    id: string;
    dependencies: string[];
    tags: string[];
    talent?: string;
    build(): Promise<void>;
    genesis?(): Promise<void>;
    synthesis?(): Promise<void>;
    statis?(): Promise<void>;
    symbiosis?(): Promise<void>;
  }

  interface AbstractObject {
    [key: string]: any;
  }

  interface AssociativeObject<T> {
    [key: string]: T;
  }

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

  interface BotFunctionalDoor {
    resonate?(resonance: Resonance): Promise<void>;
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

  interface PromptInfo {
    type?: PromptType;
    resonance?: Resonance;
    bot?: Bot;
    message?: string;
    clientType?: ClientType;
    user?: ClientUser;
    channel?: ClientChannel;
    timeLimit?: number;
    onResponse?(resonance: Resonance, prompt: Prompt): Promise<void>;
    onError?(error: PromptException): Promise<void>;
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

  interface BotDiscordClientConfig extends BotClientConfig {
    activity: string;
    integrationUrl: string;
  }

  interface BotTwitchClientConfig extends BotClientConfig {
    username: string;
    channels: string[];
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

  interface CommandClientAuthorizationListConfig {
    users: string[];
  }

  interface EventSubscription {
    method: string;
    priority: number;
  }

  interface RuntimeTask {
    service: Service;
    priority: number;
    method: string;
  }

  interface SubscriptionRecord {
    service: Service;
    event: string;
    method: string;
    priority: number;
  }

  // === Functions ===
  export function initialize(root?: string): Promise<Core>;
  export function summon(): Promise<void>;
  export function personalize(defaultText: string, tag: string, bot: Bot): Promise<string>;
  export function __(...parameters: unknown[]): Promise<string>;
  export function translate(...parameters: unknown[]): Promise<string>;

  /**
   * *****************************
   * ******* Other Classes *******
   * *****************************
   */
  class DiscordClient extends Client {
    public type: ClientType;
    public config: BotDiscordClientConfig;
    public connector: DiscordJSClient;
    public constructor(bot: Bot, config: BotClientConfig);
    public bridge(): Promise<void>;
    public build(): Promise<void>;
    public authenticate(): Promise<void>;
    public disconnect(): Promise<void>;
    public gestalt(): Promise<void>;
    public getUser(identifier: string): Promise<User>;
    public typeFor(seconds: number, channel: TextChannel | DMChannel | GroupDMChannel): Promise<void>;
    public sendError(
      destination: TextChannel | GroupDMChannel | DMChannel | User,
      {
        text,
        type,
        code,
      }?: AbstractObject,
    ): Promise<Message>;
    public sendEmbed(
      destination: TextChannel | DMChannel | GroupDMChannel | User,
      {
        title,
        description,
        header,
        url,
        color,
        image,
        thumbnail,
        fields,
        footer,
        attachments,
        timestamp,
      }?: AbstractObject,
    ): Promise<Message | Message[]>;
  }

  export class TwitchClient extends Client {
    public type: ClientType;
    public config: BotTwitchClientConfig;
    public connector: tmi.Client;
    public constructor(bot: Bot, config: BotClientConfig);
    public bridge(): Promise<void>;
    public build(): Promise<void>;
    public authenticate(): Promise<void>;
    public disconnect(): Promise<void>;
    public gestalt(): Promise<void>;
    public getUser(identifier: string): Promise<TwitchUser>;
    public typeFor(seconds: number, channel?: TwitchChannel): Promise<void>;
  }

  export class TwitchChannel {
    public id: string;
    public user: string;
    public type: string;
    public constructor(id: string, user: string, type: string);
  }

  export class TwitchMessage {
    public content: string;
    public author: TwitchUser;
    public channel: TwitchChannel;
    public context: AbstractObject;
    public constructor(content: string, author: TwitchUser, channel: TwitchChannel, context: AbstractObject);
  }

  export class TwitchUser {
    public id: string;
    public username: string;
    public displayName: string;
    public constructor(id: string, username: string, displayName: string);
    public toString(): string;
  }
}
