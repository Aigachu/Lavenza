# Lavenza [![Build Status](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/build-status/master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/?branch=master)

Lavenza is a large development project aiming to create powerful, multi-platform chatbots!

The main focus right now is Discord development, but all code will be written with the idea in mind that
future clients will be supported (and even communication between clients through a single command).

***Currently Supported Clients***
- Discord
- Twitch

***Future Clients***
- Slack (V3)

## Requirements

- [Node.js - Latest LTS Version](https://nodejs.org/en/download/)
- A good IDE. I recommend Sublime Text 3, or WebStorm if you can get it.
- A decent command-line utility application (Most of the steps in the README will use the command line)
- A brain **(very important)**
- A sense of humour ***(of utmost importance)***

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

### Setting up client credentials

For each client (as in application) your want your bot to have access to, you need to configure the needed credentials. This is all done in an un-tracked file called `.env` found in the `/app` folder.

Copy the `/app/.env.example` file into a new file called `.env` in the `/app` folder, then open your new file and take a read in there.

For each section, follow the detailed instructions in the file.

Make sure your `.env` file is properly located at `/app/.env`.

**Without proper configuration of this step, your bot will not work.**

Follow the next subsections to configure each client you want to configure. You can skip sections for clients you may not be interested in yet. This might take between 15 mins to a half hour, depending on how good you are. >:D

#### Discord
Setting up your bot to access Discord starts [here](https://discordapp.com/developers/applications/). Login to your Discord account (your main one), and create an application.

Enter a sweet name for your application. This will be the name of your Bot, so choose wisely.

Afterwards, you can access the **Bot** tab on the left hand side, and click the **Add Bot** button. Once you hit the confirmation, you'll have a bot linked to your application.

Right next to your bot's avatar, under its name, you'll see a **Token** section. Click **Copy**, and paste this token into your `.env` file that you created earlier, in the appropriate section.

The Discord section of your `.env` should look a little like this.

```
# ==========================
# ==== Discord Settings ====
# ==========================

# Discord Bot Tokens
# Enter the token of your bot. The variable name must have the following format: {BOTNAME}_DISCORD_TOKEN
# Keep this secure and don't share it! Never commit it in a repository!
# @see https://discordapp.com/developers/applications/
LAVENZA_DISCORD_TOKEN='cxNTk4NzU1ODU1.Dx28Xg.xKOvlnuak8e3bD'
```

The only thing different will be the `LAVENZA_DISCORD_TOKEN='NTExOTI3ODcxNTk4NzU1ODU1.Dx28Xg.xKOvlnuak8e3bDuSniMgDZHQubo'` line. It will have the name of **your** bot instead, and have **your** token.

#### Twitch
Setting up a bot on Twitch starts with the **[creation of an account on Twitch](). Your bot will use this new account**.

***Note: It is HIGHLY recommended to verify the email address of the bot's account. This can prevent headaches in the future.***

Once the account is created, you can [visit this link](https://twitchapps.com/tmi/) **logged in as the account your bot will use** to obtain the OAuth token for the account you created.

Copy this token and paste it into your `.env` file that you created earlier, in the appropriate section.

The Twitch section of your `.env` should look a little like this.

```
# ==========================
# ==== Twitch Settings =====
# ==========================

# Twitch OAuth Tokens
# Used to access the Twitch API with your bots.
# Each bot should have a token. The variable name must have the following format: {BOTNAME}_TWITCH_OAUTH_TOKEN
# @see https://dev.twitch.tv/docs/irc/
# @see https://twitchapps.com/tmi/
LAVENZA_TWITCH_OAUTH_TOKEN='oauth:175ftvu816f1yvb1ig18y1'
```

The only thing different will be the `LAVENZA_TWITCH_OAUTH_TOKEN='oauth:1hgy816yg1bg18g81vy9'` line. It will have the name of **your** bot instead, and have **your** token.

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

**For each client you plan on using, you must create a `CLIENT_NAME.yml` file in the same folder. Refer to the `example` bot folder to see examples of this.**

#### Recommended Configurations

- Set the name to whatever you want!
- Make the command prefix **unique**! Don't use the common '!' or '$' or even '%'. Go for something like '°°' or '.~'.
- Keep the default `examples` talent for now until you test your bot for the first time. You can enable more talents later.
- For Discord Configurations, set your own Discord ID as the Architect. You can replace the ID that's already there. You can also set some of your friends as masters or operators. (Only if you can trust them...)
- For Twitch Configurations, set your own channel as one of the channels the bot has access to, and set your username as. Also, set the username as the **EXACT** username you have for your bot's twitch account.

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

### Core

#### Multi-Bot Instances
You can run as many bots as you want at once! Each bot can have it's own commands and configurations.

#### Multi-Client support.
Each bot can connect to multiple clients at once (i.e. Twitch, Discord & Slack). This allows for potential communication between clients.

#### Translation Management
All texts in the application can be translated to any language, and supports automatic translation for [all languages supported by Google Cloud Translation](https://cloud.google.com/translate/docs/languages). All translations are stored in JSON files and any string passed through automatic translation by Google is also saved in JSON.

#### Google Translate
Texts can be automatically translated using the Google Translate API. This can be enabled by linking a Google Cloud account!

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

***Client Specific features documentation coming soon!***

## The Framework

### The 'Lavenza' Global
As development progressed, the convenience of a Global definitely came into play. When using the framework, a global named `Lavenza` is made available across the code, housing all the functions needed to access common utilities.

In many examples below, you will see this global being used. To check what's actually in the Global, refer to `/app/core/lib/Heart.js`.

### Gestalt

#### The Database Structure
All data is stored in YML files for ease of reading. It's quite simple. When using Gestalt, you simply determine the path to the file or directory you want to load/modify/create.

Querying a directory will automatically return the data in object format, reading the contents of all yml files in the directory. Additionally, it will process sub-directories recursively.

```
// Example of getting some data.
// This will get the contents of the /app/database/bots/lavenza/config YAML file.
let data = await Lavenza.Gestalt.get(`/bots/lavenza/config`);

// Example of creating a collection of data (a directory).
// This will create the /app/database/bots/lavenza/cookies directory.
await Lavenza.Gestalt.createCollection(`/bots/lavenza/cookies`);

// Example of adding data to the cookies directory.
// This will create a YAML file at the path, with the data provided.
await Lavenza.Gestalt.post(`/bots/lavenza/cookies/oreo`, {chocolate: true, milk: true});

// Example of getting all cookies data.
// This will get the contents of the cookies directory, load all the YAMLs inside, and return an object.
let data = await Lavenza.Gestalt.get(`/bots/lavenza/cookies`);
```

Get familiar with this example to understand how it works!

#### Future of Gestalt
In the future, we will aim to plug a more modern database storage service into Gestalt. It's made so that future implementations should be easily pluggable. For now, database storage in files seems to do the job nicely.

### Translation

#### Translating strings in the code
String translation can easily be achieved using Lavenza's `__()` function. Here's an example of how you would get the translation of `Hello`.

```
// Set the english string.
let hello = 'Hello';

// Get the French version.
let frenchHello = await Lavenza.__('Hello', 'fr');

// Get the Japanese version.
let japaneseHello = await Lavenza.__('Hello', 'ja');
```

Below are more complex examples of translation, covering specific cases such as: added variables to translation, specifying a locale or not & using markdown.

```
// Adding variables.
let frenchHello = await Lavenza.__('Hello {{personName}}', {personName: 'Kyle'}, 'fr');

// Using Markdown.
// Coming soon!
```

#### Storage Files
Translations are stored in the `/app/lang` folder. There will be a file for each language. This directory is normally empty at first, and the files will be generated as you trigger translation for specific languages in the code.

The default language will always be English, and all strings should be written in English in the code.

When you trigger a translation in the code, a file for the language you are translating to is automatically created. It then assumes you will translate it manually in the files. _Unless_ you use Google Translate. More on that below!

#### Google Translate
A neat feature in Lavenza is the ability to activate Google Translate. It will serve as a fallback when translations don't exist in a language you attempt to translate a string to.

So if you try to translate `'Hello'` from English to French, but the French translation doesn't exist in the `/app/lang/fr.json` file, it will use Google Translate to translate it to `'Bonjour'`, and even save it in your fr.json file for future use.

This feature is disabled by default, but can be enabled by setting it to `true` in the `/app/.env` file.

For this feature to actually work, you're going to need to set up an account with google, as well as get familiar with the Google Cloud API. All needed documentation to get this up and running is found [here](https://cloud.google.com/docs/authentication/getting-started).

If you follow the steps correctly, you should end up with a `.json` file containing an access key to your Cloud service account. The path to this file must be provided in the `/app/.env` file to allow any Google features to work properly.

### Talents

Lavenza II is designed as a plugin-based system centered around what we call **Talents**.

If you went through the starter guide, you may have seen a `talents` section in the bot's configuration file. This is where you can essentially **plug** talents into your bot.

**Talents** are collections of functionality that can easily be toggled on/off for a bot. Other words for Talents would be **Features**, **Plugins** or even **Modules**.

A great way to get familiar with talents is to take a look at the most basic one, the **pingpong** talent. It can be found in `/app/talents/pingpong`.

This Talent is built using the most basic structure and overviews the features one can take advantage of when developing new talents.

The beauty of Talents is that they are **abstract by nature**. They leave the possibility to add very pushed functionality into them and can even be seen as sub-applications that attach to your bot.

There are **Core** Talents, provided with the framework and that can be enabled already. Otherwise, you can build your own talents and add them to the `/app/talents` folder.

For an example Talent to base yourself on, definitely take a look at `/app/core/talents/example`.

#### Structure of a Talent

***Coming soon...I promise...***

#### Talent Hooks

***Coming soon...I promise...***

##### Commands

***Coming soon...I promise...***

##### Listeners

***Coming soon...I promise...***

### Commands

***Coming soon...I promise...***

#### Authority & OpLevel

***Coming soon...I promise...***

## Building & Deployment

Currently, the code is only configured to deploy on **Luxanna**, my personally rented and hosted server. To even use the build commands, you must have SSH Key access to **Luxanna**.

It's not a priority right now, but in the future I will streamline and generalize the build process more, to make it easier for people using the repository to set up deployments on Servers.

For now, feel free to take a look at what I have in the build folder so far. If you want to host your application on your own server, you can base yourself on what's there & ask me for help or tips! Though I will say, what's there right now is very lazily and quickly coded! It can be 100 times better. :)

----

# ***- January 03, 2019 -***
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

# ***- September 06, 2019 -***
> ...OH! Hello again!
>
> I almost typoed that as 'Hell again'! LOL! Now wouldn't THAT be a mood.
>
> So don't ask me why I'm writing another one of these. Maybe I just enjoy talking to myself. BUT HEY. It's fun to have
a nice record of how I've been feeling along the evolution of Lavenza. :) I'm sure I'll come back and read this in a few
months and cringe. HAHA. But WHATEVER!
>
> Lavenza's still going along strong. It's funny to think back to the original PHP version of it. Heck, it's even funnier
to reminisce about Colette, my first ever Discord Bot. For the amount of features she had (which funnily enough is not
far from the amount of features Lavenza has!), the code was ATROCIOUS. All written in ONE file, spanning about 1000 lines.
But you know what? Colette was working. She was live, in quite a few servers back when Discord was the new hotness and bots
were just beginning to be developed.
>
> Lavenza is quite different from that. It just goes to show how much I've evolved as a developer. I won't say I'm a god.
Far from that, actually. I'm sure I have a lot to learn still. But I'm quite proud of how things turned out. I'm sure there
are savants out there that can do what I did in a much cleaner, more efficient way. But I'm just happy to have something I
can say I made, and be proud of it.
>
> Lavenza III is on the horizon! We went from PHP to Javascript, and while it was a nice switch, Javascript just wasn't
cutting it when I wanted to do some GOOD OOP. I had to wrestle with Javascript to achieve OOP, and to be fair I kind of did
achieve it. As much as I could really (except when I got impatient!). But it's time for a new step. Typescript baby. The dawn
of a new era!
>
> It's fun to think about where things will head in the next few months or years. Back when I wrote the last preface, and for
quite some time afterwards, I would always ask myself how I could make Lavenza even cleaner than I already had. Now the doors
have opened for much more, and in the months to come I feel like I'll find even more ways to improve this project. Maybe we'll
switch to another programming language AGAIN! Who knows what the future holds!
>
> Alright, I think I've written enough. Let's get back to work! :D
>
> As always, ENJOY THE CODE! 