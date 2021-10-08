import { Message } from 'discord.js'

/** Data type representing someone attempting to call a command using the prefix. */
type Invocation = {
    message: Message
    /** Either the name of a valid command, or `null` for an invalid command. */
    command: string | null
    arguments: (number | string)[]
}

/**
 * ParseUtil is a utility class that breaks down text into
 * recognizable commands.
 */
export class ParseUtil {
    /**
     * @returns Message parsed into an Invocation.
     * @throws When the specified message does not invoke any command.
     */
    static getInvocation(message: Message): Invocation {
        const wordsAfterPrefix = this.getWordsAfterPrefix(message)
        const command = wordsAfterPrefix[0]
        wordsAfterPrefix.shift()
        return {
            message,
            command,
            arguments: wordsAfterPrefix,
        }
    }

    /**
     * @returns Whether the specified message is a valid invocation.
     */
    static isInvocation(message: Message): boolean {
        return this.isRespondable(message) && this.doesInvoke(message)
    }

    /**
     * @returns Whether the invocation seems fulfillable (e.g. invokes an existing/legal command)
     * or not.
     */
    static isFulfillable(invocation: Invocation): boolean {
        // TODO: Finish this
        return false
    }

    // —————————

    /**
     * @param msg Message that begins with the command prefix.
     * @returns The "words" in the invocation.
     */
    private static getWordsAfterPrefix(msg: Message): string[] {
        const PREFIX = process.env.COMMAND_PREFIX!
        const contentAfterPrefix = msg.content.slice(PREFIX.length)
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

        const contentBeforeSpace = this.getWordsAfterPrefix(msg)[0]
        const hasContentAfterPrefix: boolean = contentBeforeSpace.length !== 0
        const doesCommandBeginWithLetter: boolean = contentBeforeSpace.match(/^\w+/) !== null
        return hasContentAfterPrefix && doesCommandBeginWithLetter
    }
}
