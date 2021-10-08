/**
 * This page compiles all the commands in each folder.
 */

import { Invocation } from '../bot/parseUtil'
import { Command } from './command'

// TODO: Compile all commands from all scripts in all subdirectories.

export class PingCommand implements Command {
    name = 'ping'
    description = 'Gives a simple reply.'

    constructor() {}

    async run({ invocation }: { invocation: Invocation }): Promise<void> {
        invocation.message.channel.send('Pong!')
    }
}
