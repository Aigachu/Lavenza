# Estrella Development Cycle
So Estrella is going to be a huge feature. VERY huge. And to go through with this without planning would be a death wish.

I don't want to have to spend 1000 hours refactoring so early on, so we're going to make a list of features we want, and make a data plan to see how this will all work out.

User stories, examples, all that good stuff...We'll put them all in here in this marvelous Markdown file.

## Alpha Feature List
Below is a list of features and their explanations. Ideally, we want all of these features to have a **Scope**, meaning a vision as to where in the Development Timeline they should be focused on.

### Game Registration
Users must register to the game before actually having access to any of the other features.

Registration will be completed by simply using the main Estrella command.

`&estrella`

This should make the bot prompt the user to register by entering a unique passphrase **Provided by Aigachu**:

*As I travel on.* - Subject to change.

When that phrase is entered, an **Account** should be created for them that is linked directly to their Discord Account by account ID.

#### Objects
- Account

#### Commands

`&estrella`

#### User Stories
- As a Discord user, if I try to access any of **Estrella**'s commands other than `&estrella`, BOT will check whether I am registered to the game.
    - If **REGISTERED**, BOT will successfully process the command.
    - If **UNREGISTERED**, BOT will respond with a message saying that the user must be registered for **Estrella**.
- As a Discord user, if I use the `&estrella` command, BOT will prompt me for the unique passphrase.
    - Upon entering the **correct phrase**, an account is created and a confirmation message is sent to me.
    - Upon entering the **incorrect phrase or invalid value**, a denial message is sent to me. 

### Character Creation & Customization
Players with an account can create up to **One Character (Three in Gamma)**. Upon having a registered account, the user can use the `&estrella `

## Beta Feature List
A potential wipe will happen for the Beta. Registration will now require email validation to combat botting and multi-account exploiting.

### Email Validation Requirement