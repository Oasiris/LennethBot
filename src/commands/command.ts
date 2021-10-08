import { Bot } from '../bot/bot'
import { Invocation } from '../bot/parseUtil'

export interface Command {
    /** The name used to invoke the command. */
    name: string

    /** A brief description of what the command does. */
    description?: string

    /** Other names that also invoke this command. */
    aliases?: string[]

    /** A string demonstrating the command's usage. */
    usage?: string

    /** Run the command. */
    run(parameters: { bot: Bot; invocation: Invocation }): Promise<any>
}
