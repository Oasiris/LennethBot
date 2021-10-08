import { Message } from 'discord.js'
import { PingCommand } from '../commands'
import { Command } from '../commands/command'

/** Data type representing someone attempting to call a command using the prefix. */
export type Invocation = {
    message: Message
    /** Either the name of a valid command, or `null` for an invalid command. */
    commandName: string | null
    arguments: (number | string)[]
}

/**
 * ParseUtil is a utility class that breaks down message text into
 * recognizable commands.
 */
export class ParseUtil {
    /**
     * @returns Whether the specified message is a valid invocation.
     */
    static isInvocation(message: Message): boolean {
        return this.isRespondable(message) && this.doesInvoke(message)
    }

    /**
     * @returns Message parsed as an Invocation.
     * @throws When the specified message does not invoke any command.
     */
    static getInvocation(message: Message): Invocation {
        const wordsAfterPrefix = this.getWordsAfterPrefix(message)
        const commandName = wordsAfterPrefix[0]
        wordsAfterPrefix.shift()
        return {
            message,
            commandName,
            arguments: wordsAfterPrefix,
        }
    }

    /**
     * @returns Whether the invocation seems fulfillable (e.g. invokes an existing/legal command)
     * or not.
     */
    static canFulfill(invocation: Invocation): Command | null {
        // TODO: Finish this
        if (invocation.commandName === 'ping') {
            return new PingCommand()
        }
        return null
    }

    // —————————

    /**
     * @param msg Message that begins with the command prefix.
     * @returns The "words" in the invocation as a list of strings.
     */
    private static getWordsAfterPrefix(msg: Message): string[] {
        const PREFIX = process.env.COMMAND_PREFIX!
        const contentAfterPrefix = msg.content.slice(PREFIX.length) // Remove prefix.
        return contentAfterPrefix
            .split(' ')
            .map((word) => word.trim())
            .filter((str) => str.length > 0)
    }

    /**
     * @returns Whether the specified message is respondable – that is, whether it was authored by
     * a non-bot.
     */
    private static isRespondable(msg: Message): boolean {
        return !msg.system && !msg.author.bot
    }

    /**
     * @returns Whether the message "invokes": that is, whether it's formatted to address this bot.
     */
    private static doesInvoke(msg: Message): boolean {
        const PREFIX = process.env.COMMAND_PREFIX!
        const doesHavePrefix = msg.content.startsWith(PREFIX)
        if (!doesHavePrefix) {
            return false
        }

        const contentBeforeSpace = this.getWordsAfterPrefix(msg)[0] // Get first "word".
        const hasContentAfterPrefix: boolean = contentBeforeSpace.length !== 0
        const doesCommandNameBeginWithLetter: boolean = contentBeforeSpace.match(/^\w+/) !== null
        return hasContentAfterPrefix && doesCommandNameBeginWithLetter
    }
}
