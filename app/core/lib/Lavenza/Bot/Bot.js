"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modules.
const dotenv_1 = require("dotenv");
// Imports.
// Holy shit this LIST! LMFAO!
const TalentManager_1 = require("../Talent/TalentManager");
const Gestalt_1 = require("../Gestalt/Gestalt");
const Akechi_1 = require("../Confidant/Akechi");
const Morgana_1 = require("../Confidant/Morgana");
const Sojiro_1 = require("../Confidant/Sojiro");
const Igor_1 = require("../Confidant/Igor");
const ClientFactory_1 = require("./Client/ClientFactory");
const ResonanceFactory_1 = require("./Resonance/ResonanceFactory");
const CommandListener_1 = require("./Command/CommandListener/CommandListener");
const ClientType_1 = require("./Client/ClientType");
const PromptFactory_1 = require("./Prompt/PromptFactory");
/**
 * Provides a class for Bots.
 *
 * Bots are the fruit of this application. They're the whole point of it. And this is where it all happens!
 *
 * Configuration for bots are managed in a 'config.yml' file found in their folder. From there, functions in here
 * manage the authentication to the bot's clients and what talents the bot has.
 */
class Bot {
    /**
     * Bot constructor.
     *
     * @param id
     *   id of the bot. This is the name of the folder, not a reader-friendly name.
     * @param config
     *   Configuration loaded from the bot's 'NAME.config.yml' file.
     */
    constructor(id, config) {
        /**
         * Stores a list of all talents associated with a bot, through their ID.
         */
        this.talents = [];
        /**
         * Object to store the list of commands available in the bot.
         */
        this.commands = {};
        /**
         * Object to store the list of all command aliases available in this bot.
         */
        this.commandAliases = {};
        /**
         * Array to store a list of all Listeners attached to this bot.
         */
        this.listeners = [];
        /**
         * Array to store a list of all Listeners attached to this bot.
         */
        this.prompts = [];
        /**
         * Object to store data about the bot's master user.
         * @TODO - More specifications and maybe an interface to define it's properties.
         * @TODO - Normalize the properties.
         */
        this.joker = {};
        /**
         * Boolean to determine whether the bot is set to maintenance mode or not.
         */
        this.maintenance = false;
        /**
         * Boolean to determine if the bot is the Master Bot. There can only be one!
         */
        this.isMaster = false;
        this.id = id;
        this.config = config;
        this.directory = config.directory;
        this.maintenance = false;
        this.isMaster = false;
    }
    /**
     * Load the .env file specific to this bot, and parse its contents.
     */
    loadEnvironmentVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            this.env = dotenv_1.default.parse(`${this.directory}/.env`);
        });
    }
    /**
     * The Gestalt function is used to setup database tables for a given object.
     *
     * In this case, these are the database setup tasks for Bots.
     *
     * You can see the result of these calls in the database.
     */
    gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the database collection for this bot if it doesn't already exist.
            yield Gestalt_1.default.createCollection(`/bots/${this.id}`);
            // Initialize the database collection for this bot's configurations if it doesn't already exist.
            yield Gestalt_1.default.createCollection(`/bots/${this.id}/config`);
            // Sync core bot config to the database.
            yield Gestalt_1.default.sync(this.config, `/bots/${this.id}/config/core`);
            // Initialize i18n database collection for this bot if it doesn't already exist.
            yield Gestalt_1.default.createCollection(`/i18n/${this.id}`);
            // Initialize i18n database collection for this bot's clients configurations if it doesn't already exist.
            yield Gestalt_1.default.createCollection(`/i18n/${this.id}/clients`);
            // Create a database collection for the talents granted to a bot.
            yield Gestalt_1.default.createCollection(`/bots/${this.id}/talents`);
            // Await the bootstrapping of each talent's data.
            yield Promise.all(this.talents.map((talentKey) => __awaiter(this, void 0, void 0, function* () {
                // Load Talent from the TalentManager.
                let talent = yield TalentManager_1.default.getTalent(talentKey);
                // Create a database collection for the talents granted to a Bot.
                yield Gestalt_1.default.createCollection(`/bots/${this.id}/talents/${talent.machineName}`);
                // Await the synchronization of data between the Talent's default configuration and the database configuration.
                yield Gestalt_1.default.sync(talent.config, `/bots/${this.id}/talents/${talent.machineName}/config`);
            })));
            // Create a database collection for Commands belonging to a Bot.
            yield Gestalt_1.default.createCollection(`/bots/${this.id}/commands`);
            // Await the bootstrapping of Commands data.
            yield Promise.all(Object.keys(this.commands).map((commandKey) => __awaiter(this, void 0, void 0, function* () {
                // Load Command from the Bot.
                let command = yield this.getCommand(commandKey);
                // Create a database collection for commands belonging to a Bot.
                yield Gestalt_1.default.createCollection(`/bots/${this.id}/commands/${command.key}`);
                // Await the synchronization of data between the Command's default configuration and the database configuration.
                yield Gestalt_1.default.sync(command.config, `/bots/${this.id}/commands/${command.key}/config`);
            })));
            // Create a database collection for the clients belonging to a Bot.
            yield Gestalt_1.default.createCollection(`/bots/${this.id}/clients`);
        });
    }
    /**
     * Deployment handler for this Bot.
     *
     * Authenticates the clients and initializes talents.
     */
    deploy() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await client initialization.
            yield this.initializeClients();
            // Await clients authentication.
            yield this.authenticateClients();
            // Await building of architect.
            yield this.setJoker();
            // Await talent initializations for this bot.
            // We do this AFTER authenticating clients. Some talents might need client info to perform their initializations.
            yield this.initializeTalentsForBot();
        });
    }
    /**
     * Shutdown the bot, disconnecting it from all clients.
     */
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            // Disconnect the bot from all clients.
            yield this.disconnectClients();
        });
    }
    /**
     * Preparation handler for the Bot.
     *
     * Initializes clients, talents, commands and listeners.
     */
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            // Load environment variables.
            yield this.loadEnvironmentVariables();
            // Talent grants.
            yield this.grantTalents();
            // Command inheritance.
            yield this.setCommands();
            // Listener initialization & inheritance.
            yield this.setListeners();
        });
    }
    /**
     * For each client, we build Joker's identification and data.
     *
     * We should be able to access Joker's information from the bot at all times.
     */
    setJoker() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await processing of all clients.
            // @TODO - Factory Design Pattern for these.
            yield Promise.all(Object.keys(this.clients).map((clientKey) => __awaiter(this, void 0, void 0, function* () {
                // Depending on the type of client, we act accordingly.
                switch (clientKey) {
                    // In Discord, we fetch the architect's user using the ID.
                    case ClientType_1.default.Discord: {
                        let config = yield this.getActiveClientConfig(ClientType_1.default.Discord);
                        let client = yield this.getClient(clientKey);
                        this.joker.discord = client.fetchUser(config.joker);
                        break;
                    }
                    // In Twitch, we build a custom object using only the username.
                    // @TODO - Build a TwitchUser object using the client.
                    case ClientType_1.default.Twitch: {
                        let config = yield this.getActiveClientConfig(ClientType_1.default.Twitch);
                        this.joker.twitch = { username: config.joker };
                        break;
                    }
                }
            })));
        });
    }
    /**
     * Get the active configuration from the database for this Bot.
     *
     * @returns
     *   Returns the configuration fetched from the database.
     */
    getActiveConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            // Attempt to get the active configuration from the database.
            let activeConfig = yield Gestalt_1.default.get(`/bots/${this.id}/config/core`);
            if (!Sojiro_1.default.isEmpty(activeConfig)) {
                return activeConfig;
            }
            // Sync it to the database.
            yield Gestalt_1.default.sync(this.config, `/bots/${this.id}/config/core`);
            // Return the configuration.
            return this.config;
        });
    }
    /**
     * Retrieve a specific client from a Bot.
     *
     * @param clientType
     *   The type of client to return from the bot.
     *
     * @returns
     *   The requested client.
     */
    getClient(clientType) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clients[clientType];
        });
    }
    /**
     * Retrieve configuration for a specific client in a bot.
     *
     * @param clientType
     *   The type of client configuration to return for the bot.
     *
     * @returns
     *   The requested client configuration from the base files.
     */
    getClientConfig(clientType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine path to client configuration.
            let pathToClientConfig = `${this.directory}/${clientType}.yml`;
            // Attempt to fetch client configuration.
            if (!(yield Akechi_1.default.fileExists(pathToClientConfig))) {
                return undefined;
            }
            // Load configuration since it exists.
            return yield Akechi_1.default.readYamlFile(pathToClientConfig);
        });
    }
    /**
     * Retrieve active client configuration for this bot.
     *
     * @param clientType
     *   The type of client configuration to return for the bot.
     *
     * @returns
     *   The requested client configuration straight from the database.
     */
    getActiveClientConfig(clientType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Attempt to get the active configuration from the database.
            let activeConfig = yield Gestalt_1.default.get(`/bots/${this.id}/config/${clientType}`);
            if (!Sojiro_1.default.isEmpty(activeConfig)) {
                return activeConfig;
            }
            // If we don't find any configurations in the database, we'll fetch it normally and then save it.
            let config = yield this.getClientConfig(clientType);
            // Sync it to the database.
            yield Gestalt_1.default.sync(config, `/bots/${this.id}/config/${clientType}`);
            // Return the configuration.
            return config;
        });
    }
    /**
     * Grants talents to the Bot.
     *
     * There is a collection of Core talents that all bots will have.
     *
     * Custom Talents are configured in the Bot's configuration file. You must enter the ID (directory name) of
     * the talent in the bot's config so that it can be loaded here.
     *
     * It's important to note that Talent Classes are never stored in the bot. Only the IDs are stored.
     *
     * Talents will always be accessed through the TalentManager itself.
     */
    grantTalents() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if there are talents set in configuration.
            if (Sojiro_1.default.isEmpty(this.config.talents)) {
                yield Morgana_1.default.warn('Talents configuration missing for {{bot}}. The bot will not have any features!', { bot: this.id });
                return;
            }
            // Await validation of custom talents configured.
            // This basically checks if the talents entered are valid. Invalid ones are removed from the array.
            yield this.validateTalents();
            // After validations are complete, we merge the core talents defined for the bot, with the custom ones.
            // This completes the list of talents assigned to the bot.
            this.talents = this.config.talents;
        });
    }
    /**
     * Validates the list of custom talents configured in the bot's config file.
     *
     * If a talent is in the list, but does not exist, it will be removed from the configuration list.
     */
    validateTalents() {
        return __awaiter(this, void 0, void 0, function* () {
            // If this is the Master bot, we will grant the Master talent.
            if (this.isMaster && Sojiro_1.default.isEmpty(this.talents['master'])) {
                this.config.talents.push('master');
            }
            // Alternatively, we'll do a quick check to see if someone is trying to set the master talent in config.
            // This talent should not be set here, and instead is automatically assigned to the master bot.
            if (!Sojiro_1.default.isEmpty(this.config.talents['master']) && !this.isMaster) {
                this.config.talents = Sojiro_1.default.removeFromArray(this.config.talents, 'master');
            }
            // Await the processing of all talents in the bot's config object.
            yield Promise.all(this.config.talents.map((talentKey) => __awaiter(this, void 0, void 0, function* () {
                // Then, we'll check if this talent already exists in the Manager.
                // This happens if another bot already loaded it.
                // If it exists, we're good.
                let talent = yield TalentManager_1.default.getTalent(talentKey);
                if (!talent) {
                    return;
                }
                // Await the loading of the talent.
                // If it the load fails, we'll remove the talent from the bot's configuration.
                yield TalentManager_1.default.loadTalent(talentKey).catch((error) => __awaiter(this, void 0, void 0, function* () {
                    this.config.talents = Sojiro_1.default.removeFromArray(this.config.talents, talentKey);
                    // Send a warning message to the console.
                    yield Morgana_1.default.warn('Error occurred while loading the {{talent}} talent...', { talent: talentKey });
                    yield Morgana_1.default.warn(error.message);
                }));
                // Check talent's configuration to see if dependencies are loaded into this bot.
                yield Promise.all(TalentManager_1.default.talents[talentKey].config.dependencies.map((dependency) => __awaiter(this, void 0, void 0, function* () {
                    // If the dependency isn't found in th`is bot's config, we shouldn't load this talent.
                    if (!this.config.talents.includes(dependency)) {
                        // Send a warning to the console.
                        yield Morgana_1.default.warn(`The '{{talent}}' talent requires the '{{parent}}' talent to exist and to be enabled, but this is not the case. It will not be activated for {{bot}}.`, {
                            talent: talentKey,
                            parent: dependency,
                            bot: this.id
                        });
                        // Remove this talent from the bot.
                        this.config.talents = Sojiro_1.default.removeFromArray(this.config.talents, talentKey);
                    }
                })));
            })));
        });
    }
    /**
     * Attempt to get a command from the list of commands in this Bot.
     *
     * @param commandKey
     *   The key of the command to search for.
     *
     * @returns
     *   The command object given the key provided.
     */
    getCommand(commandKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Sojiro_1.default.isEmpty(this.commandAliases[commandKey])) {
                return this.commands[this.commandAliases[commandKey]];
            }
            return this.commands[commandKey];
        });
    }
    /**
     * Set all necessary commands to the Bot.
     *
     * Bots inherit their commands from Talents. Here we set all commands that are already loading into talents, into
     * the bots.
     *
     * By the time this function runs, the Bot should already have all of its necessary talents granted.
     */
    setCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await the processing of all talents loaded in the bot.
            yield Promise.all(this.talents.map((talentMachineName) => __awaiter(this, void 0, void 0, function* () {
                // We'll fetch the talent.
                let talent = yield TalentManager_1.default.getTalent(talentMachineName);
                // First we attempt to see if there is intersection going on with the commands.
                // This will happen if there are multiple instances of the same commands (or aliases).
                // The bot will still work, but one command will effectively override the other. Since this information is only
                // important for developers, we should just throw a warning if this happens.
                let commandsIntersection = Object.keys(this.commands).filter({}.hasOwnProperty.bind(talent.commands));
                let aliasesIntersection = Object.keys(this.commandAliases).filter({}.hasOwnProperty.bind(talent.commandAliases));
                if (!Sojiro_1.default.isEmpty(commandsIntersection)) {
                    yield Morgana_1.default.warn(`There seems to be duplicate commands in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.`, {
                        bot: this.id,
                        intersect: JSON.stringify(commandsIntersection)
                    });
                }
                if (!Sojiro_1.default.isEmpty(aliasesIntersection)) {
                    yield Morgana_1.default.warn(`There seems to be duplicate command aliases in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.`, {
                        bot: this.id,
                        intersect: JSON.stringify(commandsIntersection)
                    });
                }
                // Merge the bot's commands with the Talent's commands.
                this.commands = Object.assign({}, this.commands, talent.commands);
                this.commandAliases = Object.assign({}, this.commandAliases, talent.commandAliases);
            })));
        });
    }
    /**
     * Set all necessary listeners to the Bot.
     *
     * Bots inherit listeners from Talents. Here we set all commands that are already loading into talents, into
     * the bots.
     *
     * By the time this function runs, the Bot should already have all of its necessary talents granted.
     */
    setListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the core CommandListener.
            this.listeners.push(new CommandListener_1.default());
            // Await the processing of all talents loaded in the bot.
            yield Promise.all(this.talents.map((talentKey) => __awaiter(this, void 0, void 0, function* () {
                // Merge the bot's listeners with the Talent's listeners.
                this.listeners = [...this.listeners, ...TalentManager_1.default.talents[talentKey].listeners];
            })));
        });
    }
    /**
     * Listen to a message heard in a client.
     *
     * Now, explanations.
     *
     * This function will be used in clients to send a 'communication' back to the bot. This happens whenever a message
     * is 'heard', meaning that the bot is in a chat room and a message was sent by someone (or another bot).
     *
     * When this function is ran, we fetch the raw content of the message sent, and we build a Resonance object with it.
     * This is a fancy name for an object that stores information about a received communication. Then, we send off the
     * Resonance to the listeners that are on the bot with all the information needed to act upon the message that was
     * heard.
     *
     * Listeners will receive the Resonance, and then they react to them. Perfect example is the CommandListener, that
     * will receive a Resonance and determine whether a command was issued to the Bot. Custom Listeners defined in Talents
     * can do whatever they want when they hear a message!
     *
     * This function will also have logic pertaining to Prompts, but this can be explained elsewhere. :)
     *
     * @see ./Listener/Listener
     * @see ./Resonance/Resonance
     *
     * @param message
     *   Message object heard from a client.
     * @param client
     *   Client where the Message Object was heard from.
     */
    listen(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // First we decipher the message we just obtained.
            let content = yield Bot.decipher(message, client);
            // Construct a 'Resonance'.
            let resonance = yield ResonanceFactory_1.default.build(content, message, this, client);
            // Fire all of the bot's prompts, if any.
            yield Promise.all(this.prompts.map((prompt) => __awaiter(this, void 0, void 0, function* () {
                // Fire the listen function.
                yield prompt.listen(resonance);
            })));
            // Fire all of the bot's listeners.
            yield Promise.all(this.listeners.map((listener) => __awaiter(this, void 0, void 0, function* () {
                // Fire the listen function.
                yield listener.listen(resonance);
            })));
        });
    }
    /**
     * Set up a prompt to a specified user.
     *
     * Prompts are interactive ways to query information from a user in a seamless conversational way.
     *
     * Commands can issue prompts to expect input from the user in their next messages. For example, is a user uses the
     * '!ping' command, in the code we can use Prompts to prompt the user for information afterwards. The prompt can send
     * a message along the lines of "Pong! How are you?" and act upon the next reply the person that initially called the
     * command writes (Or act upon any future message really).
     *
     * @param user
     *   User that is being prompted.
     * @param line
     *   The communication line for this prompt. Basically, where we want the interaction to happen.
     * @param resonance
     *   The Resonance tied to this prompt.
     * @param lifespan
     *   The lifespan of this Prompt.
     *   If the bot doesn't receive an answer in time, we cancel the prompt.
     *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
     *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO! Thank you
     *   AVION for this wonderful advice!
     * @param onResponse
     *   The callback function that runs once a response has been heard.
     * @param onError
     *   The callback function that runs once a failure occurs. Failure includes not getting a response.
     */
    prompt(user, line, resonance, lifespan, onResponse, onError = (e) => { console.log(e); }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the new prompt using the factory.
            let prompt = yield PromptFactory_1.default.build(user, line, resonance, lifespan, onResponse, onError, this);
            // Set the prompt to the bot.
            this.prompts.push(prompt);
            // Await resolution of the prompt.
            yield prompt.await().catch(Igor_1.default.pocket);
        });
    }
    /**
     * Remove a prompt from the current bot.
     *
     * @param prompt
     *   The prompt to remove from this bot.
     */
    removePrompt(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.prompts = Sojiro_1.default.removeFromArray(this.prompts, prompt);
        });
    }
    /**
     * Decipher a message and obtain the raw content.
     *
     * Each client will send a message differently. i.e. Discord.JS sends a specific Message Object, whereas Twitch might
     * send back a string. This function interprets these respectively and sends back the raw content.
     *
     * @param message
     *   Message object sent by the client.
     * @param client
     *   The client that sent the message.
     *
     * @returns
     *   Given the client type, return the raw content of the message heard.
     */
    static decipher(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // Depending on the Client Type, decipher the message accordingly.
            switch (client.type) {
                // In the case of Discord, we get the 'content' property of the message object.
                case ClientType_1.default.Discord: {
                    return message.content;
                }
                // In the case of Discord, we get the 'content' property of the message object.
                // For Twitch, the Message object is custom built.
                case ClientType_1.default.Twitch: {
                    return message.content;
                }
                // case ClientTypes.Slack:
                //   return message;
            }
        });
    }
    /**
     * Authenticate all of the clients in this bot.
     */
    authenticateClients() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await the authentication of the clients linked to the bot.
            yield Promise.all(Object.keys(this.clients).map((clientType) => __awaiter(this, void 0, void 0, function* () {
                // Await authentication of the bot.
                let client = yield this.getClient(clientType);
                yield client.authenticate();
                // Run appropriate Gestalt handlers in the clients.
                yield client.gestalt();
            })));
        });
    }
    /**
     * Disconnect all of the clients in this bot.
     */
    disconnectClients() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await the authentication of the clients linked to the bot.
            yield Promise.all(Object.keys(this.clients).map((clientType) => __awaiter(this, void 0, void 0, function* () {
                // Await authentication of the bot.
                yield this.disconnectClient(clientType);
            })));
        });
    }
    /**
     * Initialize all clients for this bot.
     *
     * Initialization uses the client configuration to properly create the clients.
     */
    initializeClients() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await the processing and initialization of all clients in the configurations.
            yield Promise.all(this.config.clients.map((clientType) => __awaiter(this, void 0, void 0, function* () {
                // Load configuration since it exists.
                let clientConfig = yield this.getActiveClientConfig(ClientType_1.default[clientType]);
                if (Sojiro_1.default.isEmpty(clientConfig)) {
                    yield Morgana_1.default.warn('Configuration file could not be loaded for the {{client}} client in {{bot}}. This client will not be instantiated.' +
                        'To create a configuration file, you can copy the ones found in the "example" bot folder.', {
                        client: clientType,
                        bot: this.id
                    });
                    return;
                }
                // Uses the ClientFactory to build the appropriate factory given the type.
                // The client is then set to the bot.
                this.clients[clientType] = yield ClientFactory_1.default.build(clientType, clientConfig, this);
            })));
        });
    }
    /**
     * Disconnect from a determined client on this bot.
     *
     * @param clientType
     *   The client ID to disconnect from.
     */
    disconnectClient(clientType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simply call the client's disconnect function.
            let client = yield this.getClient(clientType);
            yield client.disconnect();
        });
    }
    /**
     * Runs each Talent's initialize() function to run any preparations for the given bot.
     */
    initializeTalentsForBot() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await the processing of all of this bot's talents.
            yield Promise.all(this.talents.map((talentKey) => __awaiter(this, void 0, void 0, function* () {
                // Run this talent's initialize function for this bot.
                let talent = yield TalentManager_1.default.getTalent(talentKey);
                yield talent.initialize(this);
            })));
        });
    }
    /**
     * Get the command prefix, after a couple of checks.
     *
     * @param resonance
     *   The Resonance we're taking a look at.
     *
     * @returns
     *   Returns the command prefix we need to check for.
     */
    getCommandPrefix(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the configuration.
            let botConfig = yield this.getActiveConfig();
            // Get bot's client configuration.
            let botClientConfig = yield this.getClientConfig(resonance.client.type);
            // Variable to store retrieved cprefix.
            let cprefix = undefined;
            // Depending on the client type, we'll be checking different types of configurations.
            switch (resonance.client.type) {
                // In the case of a Discord client, we check to see if there's a custom prefix set for the resonance's guild.
                case ClientType_1.default.Discord: {
                    // Get client specific configurations.
                    let clientConfig = yield resonance.client.getActiveConfigurations();
                    if (resonance.message.guild) {
                        cprefix = clientConfig.guilds[resonance.message.guild.id].commandPrefix || undefined;
                    }
                    break;
                }
                // In the case of a Twitch client, we check to see if there's a custom prefix set for the resonance's guild.
                case ClientType_1.default.Twitch: {
                    // Get client specific configurations.
                    let clientConfig = yield resonance.client.getActiveConfigurations();
                    if (resonance.message.channel) {
                        cprefix = clientConfig.channels[resonance.message.channel.id].commandPrefix || undefined;
                    }
                    break;
                }
            }
            // Reset it to undefined if it's empty.
            if (Sojiro_1.default.isEmpty(cprefix)) {
                cprefix = undefined;
            }
            // By default, return the following.
            return cprefix || botClientConfig.commandPrefix || botConfig.commandPrefix;
        });
    }
}
exports.default = Bot;
