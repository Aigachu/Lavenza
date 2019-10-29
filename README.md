# Lavenza ![License](https://img.shields.io/github/license/Aigachu/Lavenza?color=%233b83f7) ![Node Version Support](https://img.shields.io/node/v/lavenza?color=%233b83f7) [![npm version](https://img.shields.io/npm/v/lavenza?color=%233b83f7)](https://www.npmjs.com/package/lavenza) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6c484201a6234202b9ee8bfa60e99582)](https://www.codacy.com/manual/Aigachu/Lavenza?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Aigachu/Lavenza&amp;utm_campaign=Badge_Grade)

[![NPM](https://nodei.co/npm/lavenza.png?compact=true)](https://nodei.co/npm/lavenza/)

## About
Lavenza is a Node.js module that aims to make development of multi-platform chatbots easy, fun and robust.

It is fully written in [Typescript](http://www.typescriptlang.org/) and is fully **Object-Oriented**.

**Currently Supported Clients**
- Discord
- Twitch

**Future Clients**
- Slack (V3)
- Messenger (V4)
- Youtube (V4)
- WhatsApp (Maybe?...)
- Skype (God I don't know...)

## Installation & Quickstart
**Node.js 6.0.0 or newer is required to run Lavenza.**

### Use NPM to install the package & run `npm link`
```bash
npm install lavenza;
npm link;
```

### Run Lavenza's provisioning script and follow the instructions.
```bash
lavenza provision;
```

One of the steps will ask for you to specify an installation directory.
A **second README** file will be created at the provided path. Consult this README for a more detail explanation on how things work!

### Run Lavenza.
```bash
lavenza summon;
```

#### Run via Code.
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

## Additional Help
When executing `lavenza provision`, the installation will leave you with a directory where all of the framework's files are located.

A second README.md file will be found here containing further explanations to help you get started with development in Lavenza!

Otherwise, feel free to open issues here with questions & concerns so I can work on bettering the framework. :)

## Contributing to Lavenza
***More info soon!***

----

# ***- November 15, 2018 -***
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
