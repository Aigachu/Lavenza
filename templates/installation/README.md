# Lavenza Installation
Hello and welcome to Lavenza! This is the root of your Lavenza installation.

Configurations of your bots will be done in this folder. All file manipulations done by the framework will also only affect files in this folder (normally).

## Quickstart...Kind of!
Want to get a bot up and running ASAP? Well, follow these instructions and it shouldn't take you more than ***30 minutes!***. Might even be way less depending on the amount of clients you configure!

Emphasis on ***SHOULDN'T***...I can't make promises here HAHA.

So the first thing you're gonna wanna do if you haven't already is run the `lavenza init` command through your command line at the root of your module. 
To be fair, if you're reading this, there are high chances that you've already done this!

***Running into issues with `lavenza init`? Well if you are, open an issue in the repository and describe it! I'll quickly address those issues since I want that command to be a handy out-of-the-box spin-me-up kinda deal!***

## Running Lavenza
In your entrypoint (`index.js` or similar), paste the following JS code to run the framework.

```javascript
// Require the module.
const Lavenza = require('lavenza');

// Initialize Lavenza.
// This will read everything found in your lavenza installation folder and do what's necessary to run your bots.
Lavenza.initialize().then(() => {
  Lavenza.summon();
});
```

Running this code will run Lavenza and tell you exactly what's going on! You shouldn't run into many problems here, and you should be able to interact with your bots via whichever clients you chose to configure!

## Folder Structure
If your `lavenza init` didn't explode, you should have the following folder structure in the directory where you chose to install the Framework (a.k.a. the directory this very README is in).

Each folder found in this directory is integral to the framework. Below are quick explanations of each of their uses.

- `/bots` - Folder to house configurations of each bot you'd like to run. An example folder is located here that you can base yourself on to configure a bot.
- `/database` - Folder to house the framework's Database. All data is stored in `.yaml` files and will be found in this folder.
- `/lang` - Translations repository for the framework. If you intend to have your bots speak in multiple languages, translations will be managed in this lang folder.
- `/talents` - Folder to house custom talents you may want to develop for the bot (or obtain from others!).
