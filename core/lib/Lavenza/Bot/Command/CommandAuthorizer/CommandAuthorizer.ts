/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Igor } from "../../../Confidant/Igor";
import { Morgana } from "../../../Confidant/Morgana";
import { Sojiro } from "../../../Confidant/Sojiro";
import { Bot } from "../../Bot";
import { ClientType } from "../../Client/ClientType";
import { Eminence } from "../../Eminence/Eminence";
import { Resonance } from "../../Resonance/Resonance";
import { Command } from "../Command";
import { CommandCooldownManager } from "../CommandCooldownManager/CommandCooldownManager";

import { CommandAuthorizerConfigurationsCollection } from "./CommandAuthorizerConfigurations";

/**
 * Provides a base class for Command Authorizers.
 *
 * This class will handle the authorization of an already determined order.
 */
export abstract class CommandAuthorizer {

  /**
   * The Resonance containing the command that was heard.
   */
  protected resonance: Resonance;

  /**
   * The Bot the command was invoked from.
   */
  protected readonly bot: Bot;

  /**
   * The type of Client where this command was invoked.
   */
  protected readonly type: ClientType;

  /**
   * Object to store relevant configurations.
   */
  protected configurations: CommandAuthorizerConfigurationsCollection
    = {} as unknown as CommandAuthorizerConfigurationsCollection;

  /**
   * The command we are trying to authorize.
   */
  protected command: Command;

  /**
   * The unique identifier of the author of this Resonance.
   *
   * No matter which client we're in, the author of a message has a unique identifier. We will set this here for ease
   * of access across all checks. This will primarily be used for Permission checks and Role checks.
   */
  protected authorID: string;

  /**
   * Command Authorizers are not static since multiple commands can come in at once, and we wouldn't want conflicts.
   *
   * Constructor actions are here.
   *
   * @TODO - Holy shit...We need to make sure a prompt isn't in progress my guy. LOL.
   *
   * @param command
   *   The command that was found in the Resonance.
   * @param resonance
   *   The resonance that we are trying to locate a command in.
   */
  protected constructor(command: Command, resonance: Resonance) {
    this.resonance = resonance;
    this.bot = resonance.bot;
    this.type = resonance.client.type;
    this.command = command;
  }

  /**
   * Perform async operations that occur right after building an Authorizer.
   */
  public async build(): Promise<void> {
    // Set the identity of the author.
    // Depending on the type of client we're in, this will be set differently.
    this.authorID = await this.getAuthorIdentification();

    // We build all the configurations we'll need to make our authority checks.
    // Bot Configurations.
    this.configurations.bot = {
      base: await this.bot.getActiveConfig(),
      client: await this.bot.getActiveClientConfig(this.type),
    };

    // Command Configurations.
    this.configurations.command = {
      base: await this.command.getActiveConfigForBot(this.bot),
      client: await this.command.getActiveClientConfig(this.type, this.bot),
      parameters: await this.command.getParameterConfig(),
    };

    // Client configurations.
    this.configurations.client = await this.resonance.client.getActiveConfigurations();
  }

  /**
   * The authority function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * This is a default implementation of the method. Authorizers should be created per client, and each client
   * authorizes commands in their own way through their respective Authorizers. They will however each call this
   * default authorize function first.
   *
   * @returns
   *   Returns true if the order is authorized. False otherwise.
   */
  public async authorize(): Promise<boolean> {
    // Now we'll check if the person that invoked the command is the Joker.
    // If so, no access checks are needed.
    // @TODO - Masquerade would be nice to facilitate testing purposes!
    if (this.authorID === this.resonance.bot.joker[this.resonance.client.type].id) {
      return true;
    }

    // Check if user is allowed to use this command.
    const activationValidation = await this.validateActivation();
    if (!activationValidation) {
      await Morgana.warn("command activation failed");

      return false;
    }

    // Validate that the command isn't on cooldown.
    // Check if cooldowns are on for this command.
    // If so, we have to return.
    const commandIsOnCooldown = await this.validateCooldown();
    if (commandIsOnCooldown) {
      // Send the cooldown notification.
      await this.sendCooldownNotification();
      await Morgana.warn("command on cooldown");

      return false;
    }

    // At this point, if the configuration is empty, we have no checks to make, so we let it pass.
    if (Sojiro.isEmpty(this.configurations.command.client)) {
      // Await Lavenza.warn('No configurations were found for this command...Is this normal?...');
      return true;
    }

    // Check if the privacy is good here. Some commands can't be used in direct messages.
    const privacyValidation = await this.validatePrivacy();
    if (!privacyValidation) {
      await Morgana.warn("privacy validation failed");

      return false;
    }

    // Check if user is allowed to use this command.
    const userValidation = await this.validateUser();
    if (!userValidation) {
      await Morgana.warn("user validation failed");

      return false;
    }

    // Check if the user has the necessary eminence to execute the command.
    const eminenceValidation = await this.validateEminence();
    if (!eminenceValidation) {
      await Morgana.warn("eminence validation failed");

      return false;
    }

    // If command arguments aren't valid, we hit the message with a reply explaining the error, and then end.
    const argumentsValidation = await this.validateCommandArguments();
    if (!argumentsValidation) {
      await Morgana.warn("arguments validation failed");

      return false;
    }

    // Now, well execute the warrant() function, which does checks specific to the client.
    const clientWarrant = await this.warrant();
    // Noinspection RedundantIfStatementJS
    if (!clientWarrant) {
      await Morgana.warn("client warrant validation failed");

      return false;
    }

    return true;
  }

  /**
   * Each client will have custom validations. These will be housed in this warrant() function.
   */
  protected async abstract warrant(): Promise<boolean>;

  /**
   * Identify and return the ID of the author of this command.
   *
   * This is abstract since it will be different in every client.
   */
  protected async abstract getAuthorIdentification(): Promise<string>;

  /**
   * Get the author's eminence, given the configuration.
   *
   * The author's eminence at the time of execution can vary based on many factors. For instance, in Discord, a user
   * can have a certain eminence in one server, and a different one in another.
   *
   * Because of this, obtaining the user eminence will be done per client basis. This function will be abstract.
   */
  protected abstract async getAuthorEminence(): Promise<Eminence>;

  /**
   * Function to send the notification that the command is on cooldown.
   *
   * This is an abstract function as all Authorizers must implement their own way of alerting the users that the
   * command is on cooldown.
   */
  protected async abstract sendCooldownNotification(): Promise<void>;

  /**
   * Validates whether or not the command is activated.
   *
   * It also checks whitelisting capabilities.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  private async validateActivation(): Promise<boolean> {
    if (this.configurations.command.base.active === undefined || this.configurations.command.base.active) {
      return true;
    }
  }

  /**
   * If the resonance was received from a private message, we check if this command can be used in that context.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  private async validatePrivacy(): Promise<boolean> {
    // Get the privacy of the resonance.
    const messageIsPrivate = await this.resonance.isPrivate();

    // If the message if not private, we have no checks to make.
    if (!messageIsPrivate) {
      return true;
    }

    // Set it to true by default.
    let allowedInPrivate = true;

    // At this point we know the message is private. We return whether or not it's allowed.
    // Get the base command configuration.
    if (this.configurations.command.base.authorization
      && "enabledInDirectMessages" in this.configurations.command.base.authorization) {
      allowedInPrivate = this.configurations.command.base.authorization.enabledInDirectMessages;
    }

    // If the client configuration has an override, we'll use it.
    if (this.configurations.command.base.authorization
      && "enabledInDirectMessages" in this.configurations.command.client.authorization) {
      allowedInPrivate = this.configurations.command.client.authorization.enabledInDirectMessages;
    }

    return allowedInPrivate;
  }

  /**
   * Validate that the user is not blacklisted.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  private async validateUser(): Promise<boolean> {
    if (Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.users)) {
      return true;
    }

    return !this.configurations.command.client.authorization.blacklist.users.includes(this.authorID);
  }

  /**
   * Validates that the user has the appropriate role needed to run this command.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  private async validateEminence(requiredEminenceKey?: Eminence | string): Promise<boolean> {
    // Get the role of the author of the message.
    const authorEminence = await this.getAuthorEminence() as unknown as string;

    // If an eminence is provided in the arguments, we validate that the user has the provided eminence (or above).
    if (requiredEminenceKey) {
      return authorEminence >= Eminence[requiredEminenceKey];
    }

    // Set the required Eminence by default to None.
    let requiredEminence = Eminence.None as unknown as string;

    // Attempt to get configuration set in the base command configuration.
    if (this.configurations.command.base.authorization
      && "accessEminence" in this.configurations.command.base.authorization) {
      requiredEminence = Eminence[this.configurations.command.base.authorization.accessEminence];
    }

    // Attempt to get configuration set in the client command configuration.
    if (this.configurations.command.client.authorization
      && "accessEminence" in this.configurations.command.client.authorization) {
      requiredEminence = Eminence[this.configurations.command.client.authorization.accessEminence];
    }

    // Then we just make sure that the author's ID can be found where it's needed.
    return authorEminence >= requiredEminence;
  }

  /**
   * Validate command arguments if we need to.
   *
   * This simply checks if the command has input. When it comes to options or flags in commands, specific checks
   * must be performed per client authorizer, since each client has a different way to manage authority.
   *
   * @returns
   *   Returns true if the arguments are valid. False otherwise.
   */
  private async validateCommandArguments(): Promise<boolean> {
    // Get the arguments we need.
    const args = await this.resonance.getArguments();

    // If there are no arguments, we have nothing to validate.
    if (Sojiro.isEmpty(args._) && args.length === 1) {
      return true;
    }

    // First, we perform input validations.
    if (this.configurations.command.parameters.input) {
      if (this.configurations.command.parameters.input.required === true && Sojiro.isEmpty(args._)) {
        return false;
      }
    }

    // We'll merge the options and flags together for easier comparisons.
    const configOptions = this.configurations.command.parameters.options || [];
    const configFlags = this.configurations.command.parameters.flags || [];
    const configArgs = [...configOptions, ...configFlags];

    // If args is empty, we don't have any validations to do.
    if (Sojiro.isEmpty(configArgs)) {
      return true;
    }

    // If any arguments were given, we'll validate them here.
    const validations = await Promise.all(Object.keys(args)
                                            .map(async (arg) => {
      // If there are no arguments, we don't need to validate anything.
      if (arg === "_") {
        return true;
      }

      // Attempt to find the argument in the configurations.
      const argConfig = configArgs.find(
        (configArg) => configArg.key === arg
          || configArg.aliases !== undefined
          && configArg.aliases.includes(arg));

      // If this argument is not in the configuration, then it's an invalid argument.
      if (Sojiro.isEmpty(argConfig)) {
        await Igor.throw("{{arg}} is not a valid argument for this command.", {arg});
      }

      // Next we validate that the user has the appropriate eminence to use the argument.
      const validateAccessEminence = await this.validateEminence(Eminence[argConfig.accessEminence]);
      if (!validateAccessEminence) {
        await Igor.throw("You do not have the necessary permissions to use the {{arg}} argument. Sorry. You may want to talk to Aiga about getting permission!", {arg: argConfig.key});
      }

      return true;

    }))
      .catch((error) => {
      console.error(error);

      return false;
    });

    // Get out if it failed.
    if (!validations) {
      return false;
    }

    // If all checks pass, we can return true.
    return true;
  }

  // tslint:disable-next-line:comment-format
  // noinspection JSMethodCanBeStatic
  /**
   * Validates that the command is not on cooldown.
   *
   * If it is, we notify the user.
   *
   * @returns
   *   Returns true if the command is on cooldown. False otherwise.
   */
  private async validateCooldown(): Promise<boolean> {
    return CommandCooldownManager.check(this.resonance);
  }

}
