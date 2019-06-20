// Load environment variables
require('dotenv-safe').config()

// Dependencies
const Discord = require('discord.js')
const { not, propEq } = require('ramda')
const { createLogger } = require('./logger')


// === Variables ===

const COMMAND_PREFIX = '_'
const COMMAND_PREFIX_REGEX = /\_/


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


/* 
 * Command Map.
 *
 * Each key corresponds to a function representing that command.
 * 
 * Command functions take an object containing all bot actions, pulling
 * only those which they need, and call those bot actions to
 * make the bot do things.
 * 
 * Notice that the commands do not gain access to the original message object.
 */
const COMMANDS = {
    ping: ({ say }) => say('Pong!'),
    pong: ({ say }) => say('Ping!'),
}

/*
Note:
 - "Command" -- when one invokes an action.
 - "Action" -- something that happens as a result of a command.
*/

/**
 * Class full of functions that do neat things for incoming messages.
 */
class MessageUtil {
    static isCommand(string) {
        const isNull = val => val === null
        return not(isNull(string.match(COMMAND_PREFIX_REGEX)))
    }

    static purifyCommand(fullCommandString) {
        return fullCommandString.slice(COMMAND_PREFIX.LENGTH)
    }

    /**
     * Registers whether or not a message had an intended effect.
     * Whether a message was a command.
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
            COMMANDS[command](botActions) // Invoke action
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
        say: string => msg.channel.send(string)
    }
}


function handleMessageEvent(msg) {
    logInfo(`<${msg.author.tag}> [#${msg.channel.name}]: ${msg.content}`)
    
    // Functions
    const botActions = generateBotActions(msg)
    const onValidCommand = (command, intentObject) => {
        logInfo(`Action ${command} invoked by ${msg.author.tag}`)
    }
    const onInvalidCommand = (command, intentObject) => {
        logInfo(`Command ${command} by ${msg.author.tag} failed`)
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

bot.on('ready', handleReady)
bot.on('message', handleMessageEvent)

// bot.on('messageCreate', msg => {
//     if (msg.content === '!ping') {
//         bot.createMessage(msg.channel.id, 'Pong!')
//     } else if (msg.content === '!pong') {
//         bot.createMessage(msg.channel.id, 'Ping!')
//     }
// })

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
    // console.log(channelNameMap)

    logInfo("Channel map complete")
}


// === CLI Functionality ===

const stdin = process.openStdin();

function tokenize(str) {
    return str.trim().split(/\s+/).map(s => s.trim())
}

function getTokenSuffix(tokens, tokenStartIndex) {
    return tokens.slice(tokenStartIndex).join(' ')
}

stdin.addListener('data', data => {
    data = String(data)
    const tokens = tokenize(data)
    console.log({ data })
    console.log(tokenize(data))


    if (tokens[0] === 'info') {
        console.log('Guilds', bot.guilds)
    } else if (tokens[0] === 'send' && tokens[1] === 'channel') {
        logInfo("send channel CLI command")
        const channelName = tokens[2]
        if (!channelName) {
            logError("No channel name specified")
        }
        const channel = channelNameMap[channelName]
        const toSend = getTokenSuffix(tokens, 3)
        if (channel)
            channel.send(toSend)
        logInfo(`Tried sending "${toSend}" to channel #${channelName}`)
    } else if (tokens[0] === 'self-reply') {

    }
})



// === Driver ===

bot.login(BOT_TOKEN)