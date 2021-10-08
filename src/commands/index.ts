/**
 * This file has two functions:
 * 1. Stores "Meta" commands, or commands rely on all others. (Example: "help" command)
 * 2. Compiles and exports all commands.
 */

import { Invocation } from '../bot/parseUtil'
import { Command } from './command'

// TODO: Compile all commands from all scripts in all subdirectories.

export class PingCommand extends Command {
    static commandName = 'ping'
    static description = 'Gives a simple reply.'

    /** Dummy constructor. */
    constructor() {
        super()
    }

    async run({ invocation }: { invocation: Invocation }): Promise<void> {
        invocation.message.channel.send('Pong!')
    }
}
