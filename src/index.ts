/**
 * Entrypoint.
 */

// Load environment variables.
/* tslint:disable-next-line:no-var-requires */
require('dotenv-safe').config()

import { Bot } from './bot/bot'

const PREFIX = process.env.COMMAND_PREFIX
console.log(`Communicating with bot // prefix "${PREFIX}"...`)

// ———————————————————————————————————————————
// 1. Initialize the bot.
let bot: Bot
try {
    bot = Bot.instance // Instantiates the singleton Bot object.
} catch (err) {
    console.error(err)
    throw err
}

// Login.
bot.login()
