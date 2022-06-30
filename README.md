# Lavenza ![License](https://img.shields.io/github/license/Aigachu/Lavenza?color=%233b83f7) ![Node Version Support](https://img.shields.io/node/v/lavenza?color=%233b83f7) [![npm version](https://img.shields.io/npm/v/lavenza?color=%233b83f7)](https://www.npmjs.com/package/lavenza) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6c484201a6234202b9ee8bfa60e99582)](https://www.codacy.com/manual/Aigachu/Lavenza?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Aigachu/Lavenza&amp;utm_campaign=Badge_Grade)

[![NPM](https://nodei.co/npm/lavenza.png?compact=true)](https://nodei.co/npm/lavenza/)

## About
Lavenza is a Node.js module that aims to make development of multi-platform chatbots easy, fun and robust.

It is fully written in [Typescript](http://www.typescriptlang.org/) and is fully **Object-Oriented**.

**Lavenza is NOT a bot.** It is actually a **framework** for developers to create bots in a cleaner fashion. Its goals
are to:
- Facilitate and expand upon bot development. 
- Facilitate the execution of **multiple bots within a single application**
- Facilitate the development of **bots that simultaneously connect to multiple platforms and share information between 
them**.

## Currently Supported Clients
- Discord
- Twitch

## Future Clients
- Slack (V4)
- Youtube (V5)

## Installation & Quickstart
**Node.js 6.0.0 or newer is required to run Lavenza.**

### Use NPM to install the package
***It is highly recommended to install it as a dependency to your package and NOT globally!***
```bash
npm install lavenza;
```

### Getting Ready
The best way to experience Lavenza is to go through the process of setting up a couple bots with it!

Before proceeding, you'll need to do a little bit of diving into the clients to gather some important info for the bot
you'll create. For the sake of this example, I'm going to be using the name `pizzabot`. Feel free to replace occurrences 
of this name with a name of your choosing.

#### Discord
All Discord Bots must be registered on the Discord Developers website.

***More Details coming soon I promiseee...***

#### Twitch
Twitch bots basically live on an account you create for them. You can go ahead and create an account for your Twitch Bot
if you haven't already! Create one using the normal sign up process.

***More Details coming soon I promiseee...***

----

Now there are two ways to setup Lavenza. You can either opt for the **Manual Installation** or the **CLI Installation**. 
Follow your preference! The CLI setup might be a little harder to get into, but includes a cool interactive CLI process 
and some useful utility commands.

### CLI Installation
#### Setup your $PATH
To access the `lavenza` CLI command, you must add the following line in your $PATH.
```
# Add this to ~/.bashrc, ~/.zshrc, or ~/.profile, etc.
export PATH="./node_modules/.bin:$PATH"
```

Windows Users can find out how to alter the path for whatever program their using.

If you're using the regular CMD, then you may be able to adjust your System Variables directly. You can add 
`.\node_modules\.bin;`. as one of the entries there!

Here's an example for Cmder users. You can add this in your 'CMDER_ROOT/config/user_profile.cmd'

```
:: Add node_modules bins to PATH.
:: With this, you can access bins from installed dependant modules from the root of your NodeJS packages.
set "PATH=.\node_modules\.bin;%PATH%"
```

Now, so long as your in the root of your module, you can access any binaries that have been installed as modules, such
as the `lavenza` bin!

#### Run Lavenza's provisioning script and follow the instructions.
```bash
lavenza provision;
```

The instructions will take you through the whole process. At the time of writing this, the CLI is still in its natal
stages and isn't perfect. If you run into any errors, the best way to start clean is to delete the created `lavenza`
directory as well as the `.lavenza.yml` file. Then, you can run `lavenza provision` again!

One of the steps will ask for you to specify an installation directory. You can set this to `lavenza`.

A **second README** file will be created at this path. Consult this README for a more detailed explanation on how things 
work!

### Manual Installation
If for whatever reason you can't get the CLI setup, go through with these steps!

It seems pretty daunting but it's just moving folders around and modifying text. :)

For the sake of this example, let's pretend we want to create a bot called `pizzabot`!

1. COPY the `./node_modules/lavenza/templates/installation` folder to the root of your module and rename it to 
`lavenza`.
2. COPY the `./node_modules/lavenza/templates/lavenzafile/.lavenza.yml` to the root of your module.
3. COPY the `./lavenza/bots/example` folder and create a duplicate folder at the same location. Rename this new folder 
to `pizzabot`.
4. RENAME `./lavenza/bots/pizzabot/example.js` to `./lavenza/bots/pizzabot/pizzabot.js`.
5. RENAME `./lavenza/bots/pizzabot/.env.example` to `./lavenza/bots/pizzabot/.env`.
6. OPEN `./lavenza/bots/pizzabot/config.yml` and alter them to your leisure. Don't worry about Talents or the Locale 
configurations for now! If you want to get ahead of yourself, you can add `- Twitch` after the last line in this file to 
prepare for Twitch Bot support!
7. OPEN `./lavenza/bots/pizzabot/.env`. Here, you need to fill in the values for `DISCORD_TOKEN`, `DISCORD_CLIENT_ID` 
and finally `TWITCH_OAUTH_TOKEN` IF you're using Twitch. Use the values you gathered earlier.
8. BROWSE through the `./lavenza/bots/pizzabot/clients` folder and edit all relevant client files for the clients you 
set up. The values to modify here are pretty straightforward! There are comments to help you out.
9. OPEN the  `./.lavenza.yml` file at the root of your module.
10. Change line 9 to `root: lavenza`.
11. Change line 27 to `master: pizzabot`. Replace `pizzabot` with the name of your bot if it's different!

Annnd that should be everything! You can move on to the Execution section now!

### Running Lavenza
#### CLI Execution
```bash
lavenza summon;
```

#### JS Execution
Alternatively, in your javascript code, paste the following to run Lavenza.

```javascript
// Require the module.
const Lavenza = require('lavenza');

// Initialize Lavenza.
// This will read everything found in your lavenza installation folder and do what's necessary to run your bots.
// Initialize must always run before summoning.
Lavenza.initialize().then(() => {
  Lavenza.summon();
});
```
