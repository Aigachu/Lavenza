# Lavenza II [![Build Status](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/build-status/master)

Lavenza II is a large development project aiming to create powerful, multi-platform chatbots!

The main focus right now is Discord development, but all code will be written with the idea in mind that
future clients will be supported (and even communication between clients through a single command).

## Requirements

- [Node.js - Latest LTS Version](https://nodejs.org/en/download/)
- A good IDE. I recommend Sublime Text 3, or WebStorm if you can get it.
- A decent command-line utility application (Most of the steps in the README will use the command line)
- A brain
- A sense of humour

## Starter Guide

Before starting the guide, make sure you have all the above requirements. :)

### Installing Dependencies

There are many different ways to use Lavenza, but first you should try to get a bot up and running!

To start off, we'll use **npm** to fetch our dependencies. In your command-line, travel to the Lavenza-II folder, wherever you cloned it, and do the following:

```
cd app;
npm install;
```

This should take a few moments to install the project's dependencies.

### Configuring a Bot 

Start by copying the `/app/bots/example` folder into a new folder with the name of your bot in lowercase.

i.e. `/app/bots/lavenza`

You can also do this via the command line with the following commands, from the root of the repository. Substitute `mybot` with the name of your bot in lowercase.

```
cd app/bots;
cp -R example mybot;
```

In your new folder, you'll have one file named `example.config.yml`. Rename this file to simply `config.yml` and open it in your IDE.

This is where you will configure your bot. Carefully read through the file and adjust values accordingly.

#### Recommended Configurations

- Set the name to whatever you want!
- Make the command prefix **unique**! Don't use the common '!' or '$' or even '%'. Go for something like '°°' or '.~'.
- Keep the default pingpong talent for now until you test your bot for the first time. You can enable more talents later.
- For Discord Configurations, set your own Discord ID as one of the Gods. You can replace the ID that's already there. You can also set some of your friends as masters or operators. (Only if you can trust them...)

### Setting up client credentials

For each client your want your bot to have access to, you need to configure the needed credentials. This is all done in an untracked file called `.env` found in the `/app` folder.

Copy the `/app/.env.example` file into a new file called `.env` in the `/app` folder, then open your new file and take a read in there.

For each section, follow the detailed instructions in the file.

Make sure your `.env` file is properly located at `/app/.env`.

**Without proper configuration of this step, your bot will not work.**

### Running the application

Finally, you should be ready to run the application. To do so, use the following commands from the `/app` folder of the repository.

```
node summon --babel
```

This will run the application and connect your bot to any clients you configured.

You can go ahead and use your command prefix to test the `ping` command! i.e. `;.ping`!

If your bot responds, we're on the right track!

Report any issues to me. I'll always prioritize issues pertaining to the setup of the application.

## Features

Here is a quick list of many features Lavenza has, for you to get a feel for it!

### Core Features

#### Multi-Bot Instances
You can run as many bots as you want at once! Each bot can have it's own commands and configurations.

#### Multi-Client support.
Each bot can connect to multiple clients at once (i.e. Twitch, Discord & Slack). This allows for potential communication between clients.

#### Translation
All texts in the application can be translated to any language, and supports automatic translation for [all languages supported by Google Cloud Translation](https://cloud.google.com/translate/docs/languages). All translations are stored in JSON files and any string passed through automatic translation by Google is also saved in JSON.

#### Credentials Management in a .env file.
Credentials are all managed in a git-ignored .env file. This assures that sensitive information like bot tokens are not committed to the repository.

#### Talents
Bot features are organized in Talents. They can be seen as collections of features that can easily be added / removed from a bot at any given time.

#### Commands
With bots come commands. Easy development of commands for bots. Commands can be configured to only work on certain clients. They can also be configured with permissions.

#### Command Input, Arguments & Flags.
Each command can have a set of configured arguments and flags that affect what the command does. `!ping --arg1 -flag Hello` is a good example.

#### Configuration Management in YAML files.
All configurations are easily managed in YAML files, which are easy to understand and edit.

#### Database Storage
Database storage is currently supported and all information is stored in YAML files. The database is easily accessible in the Code through a REST inspired format.

#### Permissions Management
Permissions per command can be configured easily with the **oplevel** concept. A higher **oplevel** means higher permissions. Furthermore, permissions can be set per command as well as per command arguments.

#### Premade Talents
Many talents for common commands such as `!coinflip` or `!rolldice` already exist. They can be used as examples to make your own commands.

## The Framework

### The 'Lavenza' Global

***Documentation soon...I promise...***

#### Confidants

***Documentation soon...I promise...***

### Gestalt

#### The Database Structure

***Documentation soon...I promise...***

#### Future of Gestalt

***Documentation soon...I promise...***

## Talents

Lavenza II is designed as a plugin-based system centered around what we call **Talents**.

If you went through the starter guide, you may have seen a `talents` section in the bot's configuration file. This is where you can essentially **plug** talents into your bot.

**Talents** are collections of functionality that can easily be toggled on/off for a bot. Other words for Talents would be **Features**, **Plugins** or even **Modules**.

A great way to get familiar with talents is to take a look at the most basic one, the **pingpong** talent. It can be found in `/app/talents/pingpong`.

This Talent is built using the most basic structure and overviews the features one can take advantage of when developing new talents.

The beauty of Talents is that they are **abstract by nature**. They leave the possibility to add very pushed functionality into them and can even be seen as sub-applications that attach to your bot.

### Structure of a Talent

### Talent Hooks

#### Commands

##### Authority & OpLevel

#### Listeners

***Documentation soon...I promise...***

## Building & Deployment

***Documentation soon...I promise...***

----

> ...Oh! Hi! Didn't see you there.
>
>The name's Aigachu. You may or may not know me. But that's unimportant. 
>
>I've made many bots over the last few years. Many of which were dirty, code
wise. This project is sort of a...Battle! A personal battle to make a clean,
fun application. Hopefully I can look back at this code in
a few years and not cringe or fight back puke. But chances are I will if things go the way they always do. Haha!
>
>My goal with this project is to make bot development easy and scalable.
I also want to be proud of a project and see it to the end for once...
Let's see how far I get with this one!
>
>A few months ago, I decided I wanted to make my best Discord bot in PHP. This
quickly changed as I realized that PHP would probably not be the best
solution if I planned on making bots that would be compatible with a bunch of
different platforms.
 >
>This original PHP project was named Lavenza. This brings
me to the name of this project. Lavenza II. It's the successor to this PHP project
and looks to follow clean design patterns as much as possible, despite Javascript's
tendency to be more procedural...That in itself is a battle, but it's not impossible!
>
>In any case...I don't even know why I'm writing a preface. Enjoy the code!