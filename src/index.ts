/**
 * Entrypoint.
 */

// Load environment variables.
/* tslint:disable-next-line:no-var-requires */
require('dotenv-safe').config()

import Discord from 'discord.js'

import { Bot } from './bot/bot'

const PREFIX = process.env.COMMAND_PREFIX
console.log(PREFIX, process.env.BOT_TOKEN)

// ———————————————————————————————————————————
// 1. Initialize the bot.
let bot: Bot
try {
    bot = new Bot(process.env.BOT_TOKEN)
} catch (err) {
    console.error(err)
    throw err
}








// Login.
bot.login()
