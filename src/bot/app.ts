/**
 * Entry script for the program.
 * Contains bot setup and login, in addition to basic message parsing logic.
 */

// Load environment variables
/* tslint:disable-next-line:no-var-requires */
require('dotenv-safe').config()

import Discord = require('discord.js')
import R = require('ramda')
import { not, propEq } from 'ramda'

import { instantiateLogger as createLogger } from './logger'
import allCommands from './commands'
import { startCli } from './cli'

import { FullCommand } from './models/command'
import { MessageIntent } from './models/messageIntent'

import { StringUtil } from './util/stringUtil'

import _ordinal = require('ordinal')
const ordinal = _ordinal as any

/* Constants */

const COMMAND_PREFIX = process.env.COMMAND_PREFIX

/** A map from command names to functions. Each function takes an object of bot actions. */
const COMMANDS = allCommands

// === Logger Setup ===

const logger = createLogger()

// === Bot Setup ===

let bot: Discord.Client
try {
    bot = new Discord.Client()
} catch (err) {
    logger.error(bot)
    process.exit(1)
}

const { BOT_TOKEN } = process.env

// === Commands ===



/**
 * Class full of functions that do neat things for incoming messages.
 */
export class MessageUtils {
    private static isCommand(str: string, commandBank = allCommands) {
        const isNull = (val) => val === null
        return str.indexOf(COMMAND_PREFIX) === 0
    }
    
    private static stripPrefix(fullCommandString: string, commandBank = allCommands) {
        return fullCommandString.slice(COMMAND_PREFIX.length)
    }

    /**
     * Registers whether or not a message was intended to revoke a command.
     * Returns an object with { hasIntent } as either true or false.
     */
    static getIntent(msg: Discord.Message): MessageIntent | { hasIntent: false } {
        let hasIntent = false
        const { content } = msg

        const isCommand = MessageUtils.isCommand(content)
        if (isCommand) {
            hasIntent = true
            const tokenizableContent = MessageUtils.stripPrefix(content)
            const tokens = StringUtil.tokenize(tokenizableContent)
            const verb = tokens[0]
            const intentObject = {
                msg,
                content,
                hasIntent,
                verb,
                tokens,
            }
            console.log(intentObject)
            return intentObject
        }
        return { hasIntent: false }
    }

    /** 
     * Does two things:
     *  - Evaluates if a command translates to a valid action.
     *  - If so, executes said action.
     * @returns Whether or not an action was executed.
     */
    static async actOnIntent(
        intent: MessageIntent,
        botActions: { say: (actions: any) => void, bot?: Discord.Client },
        onValid: (verb: string, intent: MessageIntent) => void,
        onInvalid: (verb: string, intent: MessageIntent) => void,
    ): Promise<boolean | void> {
        const handleValid = () => onValid(verb, intent)
        const handleInvalid = () => onInvalid(verb, intent)

        const validVerbs = Object.keys(COMMANDS)
        const { verb, tokens } = intent

        console.log({ verb })
        if (!validVerbs.includes(verb)) {
            handleInvalid()
            return false
        }

        const cmd = COMMANDS[verb]
        let commandFunction
        let params
        let args
        const commandPayload = R.clone(botActions)
        console.log({ cmd })
        
        if (typeof cmd === 'function') {
            commandFunction = cmd
            params = []
            args = null
            // console.log({ cmd })
        } else if ((cmd as FullCommand).effect) {
            commandFunction = cmd.effect
            params = cmd.params || []
        } else {
            botActions.say(`That command is currently broken—try again later!`)
        }

        // Execute
        try {
            // Validate params/args
            const validation = CommandUtils.validateParams({ params, tokens })
            if (!validation.isValid) {
                botActions.say(validation.message!)
                return false
            }

            // Inject into payload
            commandPayload.args = {} as any
            for (const [tokenIdx, param] of params) {
                const arg = tokens[tokenIdx] || undefined
                if (arg) {
                    commandPayload.args[param] = arg
                }
            }
            commandPayload.bot = bot
            // TODO

            // Execute command
            console.log({ commandPayload })
            handleValid()
            commandFunction(commandPayload)
            return
        } catch (err) {
            console.error(err)
        }
        
        /*
        I want to put in:


        bot,
        tokens: StringUtil.tokenize(msg.content),
        msg,
        */


        // if (validActions.includes(command)) {
        //     onValid(command, botActions, intentObject)
        //     try {
        //         const cmd = COMMANDS[command]
        //         if (typeof cmd === 'function') {
        //             await COMMANDS[command](botActions) // Invoke action
        //         } else if ((cmd as FullCommand).effect) {
        //             await COMMANDS[command].effect(botActions)
        //         }
                
        //     } catch (err) {
        //         logger.error(err)
        //     }
        // } else {
        //     onInvalid(command, intentObject)
        // }
    }
}

class CommandUtils {
    static validateParams({
        params,
        tokens,
    }): {
        isValid: boolean,
        message?: string,  // Error message.
    } {
        if (!params) {
            return { isValid: true }
        }
        for (const [tokenIdx, param, isRequired] of params) {
            console.log([tokenIdx, param, isRequired])
            console.log(tokens.length)
            if (isRequired && tokenIdx >= tokens.length) {
                const errString = `Missing required field: "${param}" (${ordinal(tokenIdx)} parameter)`
                return {
                    isValid: false,
                    message: errString,
                }
            }
        }
        return { isValid: true }
    }
}

/**
 * Given a Message, returns actions that can be invoked by the bot
 * using properties of the object.
 */
function generateBotActions(msg: Discord.Message) {
    return {
        say: string => msg.channel.send(string),
    }
}

async function handleMessageEvent(msg: Discord.Message) {
    if (msg.author.bot) {
        return
    }
    if (msg.channel instanceof Discord.TextChannel) {
        logger.verbose(`<${msg.author.tag}> [#${msg.channel.name}]: ${msg.content}`)
    }

    // Functions
    const botActions = generateBotActions(msg)
    const onValidCommand = (command, intentObject) => {
        logger.verbose(`Action ${command} invoked by ${msg.author.tag}`)
    }
    const onInvalidCommand = (command, intentObject) => {
        logger.verbose(`Command ${command} by ${msg.author.tag} failed`)
    }
    
    const intent = MessageUtils.getIntent(msg)
    if (intent.hasIntent) {
        await MessageUtils.actOnIntent(
            intent, botActions, onValidCommand, onInvalidCommand
        )
    }
}

function handleReady() {
    logger.info('Ready!')
}

// === Bot Handling ===

bot.on('ready', handleReady)
bot.on('message', handleMessageEvent)

// === Channel Map ===

// Eggland guild ID
const { GUILD_ID } = process.env
console.log({ GUILD_ID })

const channelNameMap = {}

bot.on('ready', createChannelMap)

function createChannelMap() {
    const guildMap = bot.guilds
    const soleGuild = guildMap.array()[0]
    const channelMapById = soleGuild.channels
    // console.log(channelMapById, channelMapById.array().length)
    
    // channelNameMap = {}
    let textChannels = channelMapById.array().filter(propEq('type', 'text'))
    textChannels.forEach(ch => {
        channelNameMap[ch.name] = ch
    })

    logger.info("Channel map complete")
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