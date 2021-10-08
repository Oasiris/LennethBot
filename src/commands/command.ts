import { Bot } from '../bot/bot'
import { Invocation } from '../bot/parseUtil'

/**
 * Template for all commands.
 *
 * IMPORTANT: Classes that implement Command may NOT have **side effects** in their constructor.
 *
 * (Ideally, they should all have "dummy constructors" that are completely empty.)
 */
export abstract class Command {
    /** The name used to invoke the command. */
    static commandName: string

    /** A brief description of what the command does. */
    static description?: string

    /** Other names that also invoke this command. */
    static aliases?: string[]

    /** A string demonstrating the command's usage. */
    static usage?: string

    /** Run the command. */
    abstract run(parameters: { bot: Bot; invocation: Invocation }): Promise<any>
}
