/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares an interface schema for Core Lavenza settings.
 */
export interface CoreSettings {

  /**
   * Store the path to the main directory where the framework is installed.
   * This path is relative to the path where the Lavenzafile is located.
   */
  root: string;

  /**
   * Store all language settings for the framework.
   */
  locale: CoreLocaleSettings;

  /**
   * Store main configurations.
   */
  config: CoreConfigurationsSettings;

  /**
   * Store services configurations.
   */
  services: CoreServiceSettings;

}

/**
 * Store configurations pertaining to the locale.
 */
export interface CoreLocaleSettings {

  /**
   * Store default locale value.
   */
  default: string;

}

/**
 * Store core main configurations.
 */
export interface CoreConfigurationsSettings {

  /**
   * Bot configurations.
   */
  bots: CoreBotSettings;

}

/**
 * Store core Bot configurations.
 */
export interface CoreBotSettings {

  /**
   * Store the machine name of the master bot.
   */
  master: string;

  /**
   * Store machine names of bots that should be booted automatically on program execution.
   */
  autoboot: string[];

}

/**
 * Store settings pertaining to many services Lavenza can use.
 */
export interface CoreServiceSettings {

  /**
   * Store google service settings.
   */
  google: CoreGoogleServiceSettings;

}

/**
 * Store the settings for the Google service.
 */
export interface CoreGoogleServiceSettings {

  /**
   * Store google translate settings.
   */
  translate: CoreGoogleServiceTranslateSettings;

}

/**
 * Store settings pertaining to Google's Translate service.
 */
export interface CoreGoogleServiceTranslateSettings {

  /**
   * Store whether or not this service is enabled.
   */
  enabled: boolean;

  /**
   * Store project ID of the Google Cloud project.
   */
  projectId: string;

}
