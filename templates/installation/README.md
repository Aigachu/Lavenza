# Lavenza Installation
Hello and welcome to Lavenza! This is the root of your Lavenza installation.

Configurations for your bots will be done in this directory.

The guide below assumes that you already read and went through the **README found at the root of this repository**! Give that a look if you haven't.

## Quickstart After Provisioning
If you went through things normally, you should be here **after** having done the `lavenza provision` command. 
If you went through the whole process, including configuration of clients for your bot, then in theory you should be good to go!
You can try the following command via command line to see if it works out or explodes:

```bash
lavenza summon;
```

This will run Lavenza and in theory, your bots should be online if you don't get any errors.

**Note that the only client enabled by default is Discord. To test Twitch connection, add 'Twitch' to the list of enabled clients in your bot's config file.**

```yaml
# Clients
# Configurations for which clients this bot will access.
# For each client added, a respective CLIENT_NAME.yml must be found in this directory with the client's configuration.
# You can always find example templates of these files in the example bot!
#
# Supported Clients:
# - Discord
# - Twitch
clients:
  - Discord
  - Twitch
```

### Running Lavenza via Code
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

## Command List
- `lavenza provision` - Runs the provisioning script and attempts to repair broken configurations or installations.
- `lavenza summon` - Runs Lavenza.
- `lavenza generate` - Generate a Bot, Command or Talent.
- `lavenza customize` - Customize a part of the installation. Can be used to setup clients interactively.

## Detailed Guide
This detailed part of the guide will really get into the nitty gritty of things! It's a good read if you want to get used to the framework.

### Provisioning
`lavenza provision` is the goto command for setting up the barebones of the framework. This command will handle 3 main things:

1. The creation of your **Lavenzafile** (`.lavenza.yml`).
2. The provisioning of your **installation directory**, or **Lavenzaroot**.
3. The setup of your **Master Bot** (Essentially, your main bot).

After running `lavenza provision` and following all of the instructions, you should have the following:

- A `.lavenza.yml` file a the root of your module.
- A new directory created by the framework at the installation path you specified. (i.e. `your_module/lavenza`).

### Installation Folder Structure
Each folder found in the installation path is integral to the framework. Below are quick explanations of each of their uses.

- `/bots` - Folder to house configurations of each bot you'd like to run. An example folder is located here that you can base yourself on to configure a bot.
- `/database` - Folder to house the framework's Database. All data is stored in `.yml` files and will be found in this folder.
- `/lang` - Translations repository for the framework. If you intend to have your bots speak in multiple languages, translations will be managed in this lang folder.
- `/talents` - Folder to house custom talents you may want to develop for the bot (or obtain from others!). This is mostly for advanced OOP stuff, so don't worry about it for now.

### Configuring a Bot
Provisioning Lavenza should have taken you through the interactive process of setting up a bot. Below we'll explain what exactly happens here.

For every bot you have, a dedicated folder will be created for each bot in the `/bots` folder.
Say you have a bot named `emma`, then all of emma's configurations will be located at `/bots/emma`, relative to Lavenza's installation path.

Each file in here is important! Let's go through them:

#### Environment File (.env)
`.env` files hold sensitive and important information used by your bots. These files **are never tracked in Git** for security purposes.

Information like authentication tokens will be found in this file.

When you provision or generate a bot and customize clients for it through the command line, a new `.env` file will be generated for you.
Alternatively, you can always copy the `.env.example` file's contents to manually create a new one and repopulate the information.

Without this file, your bots will not connect to any clients!

#### Configuration File (config.yml)
The `config.yml` file holds general configuration for a bot. 

The **Command Prefix** can be customized here and should always be non-generic. Using a prefix like `!` or `$` will cause you and others headaches
in the long run!

More importantly, **Clients** are enabled here for your bot. Make sure you add each client you want your bot to connect with to the list.
Discord will always be enabled by default since it's the main Client this framework was developed with, but you can always add Twitch and more later.

#### Client Configuration Files (discord.yml, twitch.yml)
These files are used for client specific configurations.

The **Command Prefix** can be overriden here for specific clients.

The **Joker** entry is another way of saying **Admin**. Essentially, you must enter your own unique identifier here so that your
bot always knows who it's maker is. This can come in handy in the future for specific core features that can help you!

Otherwise, each client has its own set of configurations that need to be set here. Read the comments in these files carefully
and adjust them as needed.

### Running Multiple Bots
Running multiple bots is fairly simple! 

First, you'll need a folder for each bot you'd like to run. You can use the `lavenza generate bot` command to do this via command line.
Alternatively, you can copy the `example` folder that comes with the installation and do it manually.

After configuring multiple bots, go into your `.lavenza.yml` file and scroll to the `autoboot` section.

Here, all you have to do is add the bots you'd like Lavenza to automatically activate whenever you summon!

#### Master Bot's `boot` & `shudown` commands
If you have bots configured, but don't want them to boot automatically, you can omit them from the `autoboots` configuration and
instead manage them manually by using your Master Bot's cool powers!

Via any Client, you can tell your master bot to boot another bot by typing in `COMMAND_PREFIX boot BOT_NAME` in a chat where your master bot can hear you!

Try it out! It's pretty neat.

## More documentation coming soon!
- Gestalt, Chronicler & The Database
- Multi-client communications
- Translations & Google Translate
- Custom Talents & Commands
- Personalizations
- Confidants
- User Eminence
- Prompts

