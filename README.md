# Lavenza II [![Build Status](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Aigachu/Lavenza-II/build-status/master)

Lavenza II is a large development project aiming to create powerful, multi-platform chatbots!

The main focus right now is Discord development, but all code will be written with the idea in mind that
future clients will be supported (and even communication between clients through a single command).

## Requirements

- [Node.js - Latest LTS Version](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- A good IDE. I recommend Sublime Text 3, or WebStorm if you can get it.
- A decent command-line utility application (Most of the steps in the ReadMe will use command line tools)
- A brain
- A sense of humour

## Starter Guide

Before starting the guide, make sure you have all the above requirements. :)

### Installing Dependencies

There are many different ways to use Lavenza, but first you should try to get a bot up and running!

To start off, we'll use **npm** to fetch our dependencies. In your command-line, travel to the root of this repository and do the following:

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
- For Discord Configurations, set your own Discord ID as one of the Gods. You can replace the ID that's already there. You can also set some of your friends as operators and masters. (Only if you can trust them...)

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

#### Listeners

***More coming soon...***

## Gestalt

***More coming soon...***

## Building & Deployment

***More coming soon...***

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