# Lavenza ![License](https://img.shields.io/github/license/Aigachu/Lavenza?color=%233b83f7) ![Node Version Support](https://img.shields.io/node/v/lavenza?color=%233b83f7) [![npm version](https://img.shields.io/npm/v/lavenza?color=%233b83f7)](https://www.npmjs.com/package/lavenza) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/6c484201a6234202b9ee8bfa60e99582)](https://www.codacy.com/manual/Aigachu/Lavenza?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Aigachu/Lavenza&amp;utm_campaign=Badge_Grade)

[![NPM](https://nodei.co/npm/lavenza.png?compact=true)](https://nodei.co/npm/lavenza/)

## About
Lavenza is a Node.js module that aims to make development of multi-platform chatbots easy, fun and robust.

It is fully written in [Typescript](http://www.typescriptlang.org/) and is fully **Object-Oriented**.

**Currently Supported Clients**
- Discord
- Twitch

**Future Clients**
- Slack (V4)
- Messenger (V4)
- Youtube (V5)
- WhatsApp (Maybe?...)
- Skype (Meh...)

## Installation & Quickstart
**Node.js 6.0.0 or newer is required to run Lavenza.**

### Use NPM to install the package.
```bash
npm install lavenza;
```

### Run Lavenza's provisioning script and follow the instructions.
```bash
lavenza provision;
```

One of the steps will ask for you to specify an installation directory.
A **second README** file will be created at the provided path. Consult this README for a more detailed explanation on how things work!

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

# ***- November 25th, 2019 -***
> So...One yeah huh. Wow.
>
> Here I am in Greece, at 7:45 AM, typing up another preface for this project. I must really cherish Lavenza. HAHA.
>
> Hello again! Welcome to yet another entry it what seems to be a chronicle of the development of this framework of mine,
where I empty my thoughts and think about the future. HAHA. Trust me, this is more therapeutic than it seems.
>
> I find it funny how the last entry was two months ago and I ended with "Lavenza III is on the horizon!". Truth is, we're
already at Lavenza IV. The changes I made after dropping version III were...Huge, to say the least. But man is Lavenza IV clean.
>
> Lavenza feels even more like a framework now. There are mountains of work to do until I can truly say that the project is complete,
but in its current state it's definitely usable and accomplishes A LOT. Making multiple bots has never been easier for me, and I've done
so much. Bash commands for an interactive process...Service container logic to allow for intricate feature development...God, so much.
>
> By day, I work a 9 to 5 as a Drupal developer. Anyone that has touched Drupal will **feel** it's inspiration when looking at the inner
workings of the framework. I inspired myself from Drupal a lot, or at least the good parts of it. But it just makes me wonder...How many
more technologies will I touch in the next few years? And how many of them will inspire me enough that I bleed its essence into this project?
>
> Exciting, honestly. To think about how Lavenza V or Lavenza VI will look. But for now, I think we're good.
>
> As I love to say, I'm no god nor do I even consider myself a good developer. There are excellent developers out there that enjoy it more
and are miles better at it than I am. But I just realize how important it is to do something, for yourself, and to be proud of it.
>
> Chances are Lavenza IV will be on version IV for awhile. Far longer than version III's lifecycle! LOL! But it isn't because I have nothing
left to do. There is still a lot to be done, a lot to improve and clean up. Hell, more clients to configure and cover support for. But version IV
is where we'll do a lot of stabilization and cleanup. That, and another project has begun. The first official project of mine to make use of Lavenza: 
[Estrella](https://github.com/Aigachu/Estrella).
>
> ...Why am I even adding a link there? It's a private project! HAHA. But hey, if you have access to that, then know that it's an honor to work with you.
>
> Anyways, it's time for enjoy the rest of my time in Athens. Next preface? When Lavenza V drops.
>
> See you then.
