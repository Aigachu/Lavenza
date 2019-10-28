# Lavenza Installation
Hello and welcome to Lavenza! This is the root of your Lavenza installation.

Configurations for your bots will be done in this directory.

The guide below assumes that you already read and went through the **README found at the root of this repository**! Give that a look if you haven't.

## Quickstart After Provisioning
If you went through things normally, you should be here **after** having done the `lavenza provision` command. 
If you went through the whole process, including configuration of clients for your bot, then in theory you should be good to go!
You can try the following command via command line to see if it works out or explodes:

`lavenza summon`

This will run Lavenza and in theory, your bots should be online if you don't get any errors.

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

#### Command Prefix

#### Clients

##### Discord
##### Twitch

### Running Multiple Bots

