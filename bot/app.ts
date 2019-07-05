// Load environment variables
require('dotenv-safe').config()

// Dependencies
import * as Discord from 'discord.js'
import { not, propEq } from 'ramda'
import { instantiateLogger as createLogger } from './logger'
import commands from './commands'
import { startCli } from './cli'


// === Variables ===

const COMMAND_PREFIX = process.env.COMMAND_PREFIX


// === Logger Setup ===


const logger = createLogger()
const logInfo = logger.info
const log = logger.log
const logError = logger.error



// === Bot Setup ===


let bot
try {
    bot = new Discord.Client()
} catch(err) {
    logError(bot)
    process.exit(1)
}

const { BOT_TOKEN } = process.env
console.log({ BOT_TOKEN })


// === Commands ===


/** 
 * A map from command names to functions.
 * Each function takes an object of bot actions.
 */
const COMMANDS = commands


/**
 * Class full of functions that do neat things for incoming messages.
 */
export class MessageUtil {
    static isCommand(string: string, commandBank = commands) {
        const isNull = val => val === null
        return string.indexOf(COMMAND_PREFIX) === 0
    }
    
    static purifyCommand(fullCommandString, commandBank = commands) {
        return fullCommandString.slice(COMMAND_PREFIX.length)
    }

    /**
     * Registers whether or not a message was intended to revoke a command.
     * Returns an object with { hasIntent } as either true or false.
     */
    static getIntent(messageContent) {
        let hasIntent = false

        const isCommand = MessageUtil.isCommand(messageContent)
        if (isCommand) {
            hasIntent = true
            const pureCommand = MessageUtil.purifyCommand(messageContent)
            return {
                hasIntent,
                isCommand, 
                message: messageContent,
                pureCommand,
                command: pureCommand,
            }
        }
        return { hasIntent: false };
    }

    /** 
     * Does two things:
     *  - Evaluates if a command translates to a valid action.
     *  - If so, executes said action.
     */
    static executeActionFromCommand(intentObject, botActions, onValid, onInvalid) {
        const validActions = Object.keys(COMMANDS)
        const { command } = intentObject
        if (validActions.includes(command)) {
            onValid(command, botActions, intentObject)
            try {
                COMMANDS[command](botActions) // Invoke action
            } catch (err) {
                logger.error(err)
            }
        } else {
            onInvalid(command, intentObject)
        }
    }
}

/**
 * Given a Message, returns actions that can be invoked by the bot
 * using properties of the object.
 */
function generateBotActions(msg) {
    return {
        say: string => msg.channel.send(string),
        bot
    }
}

function handleMessageEvent(msg: Discord.Message) {
    if (msg.author.bot) {
        return;
    }
    if (msg.channel instanceof Discord.TextChannel)
        logger.verbose(`<${msg.author.tag}> [#${msg.channel.name}]: ${msg.content}`)
    
    // Functions
    const botActions = generateBotActions(msg)
    const onValidCommand = (command, intentObject) => {
        logger.verbose(`Action ${command} invoked by ${msg.author.tag}`)
    }
    const onInvalidCommand = (command, intentObject) => {
        logger.verbose(`Command ${command} by ${msg.author.tag} failed`)
    }
    
    
    const { content } = msg
    const intent = MessageUtil.getIntent(content)
    if (intent.hasIntent) {
        MessageUtil.executeActionFromCommand(
            intent, botActions, onValidCommand, onInvalidCommand
        )
    }
}

function handleReady() {
    logInfo("Ready!")
}

// === Bot Handling ===

bot.on('ready', handleReady)
bot.on('message', handleMessageEvent)


// === Channel Map ===

// Eggland guild ID
const { GUILD_ID } = process.env
console.log({ GUILD_ID })

let channelNameMap = {};

bot.on('ready', createChannelMap)

function createChannelMap() {
    const guildMap = bot.guilds
    const soleGuild = guildMap.array()[0]
    const channelMapById = soleGuild.channels
    // console.log(channelMapById, channelMapById.array().length)
    
    channelNameMap = {}
    let textChannels = channelMapById.array().filter(propEq('type', 'text'))
    textChannels.forEach(ch => {
        channelNameMap[ch.name] = ch
    })

    logInfo("Channel map complete")
}


// === CLI Functionality ===

bot.on('ready', () => startCli(bot, logger))

// const stdin = process.openStdin();

// function tokenize(str) {
//     return str.trim().split(/\s+/).map(s => s.trim())
// }

// function getTokenSuffix(tokens, tokenStartIndex) {
//     return tokens.slice(tokenStartIndex).join(' ')
// }

// stdin.addListener('data', data => {
//     data = String(data)
//     const tokens = tokenize(data)
//     console.log({ data })
//     console.log(tokenize(data))


//     if (tokens[0] === 'info') {
//         console.log('Guilds', bot.guilds)
//     } else if (tokens[0] === 'send' && tokens[1] === 'channel') {
//         logInfo("send channel CLI command")
//         const channelName = tokens[2]
//         if (!channelName) {
//             logError("No channel name specified")
//         }
//         const channel = channelNameMap[channelName]
//         const toSend = getTokenSuffix(tokens, 3)
//         if (channel)
//             channel.send(toSend)
//         logInfo(`Tried sending "${toSend}" to channel #${channelName}`)
//     } else if (tokens[0] === 'self-reply') {

//     }
// })




// === Driver ===

bot.login(BOT_TOKEN)