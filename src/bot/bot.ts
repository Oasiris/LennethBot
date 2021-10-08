import Discord, { Message } from 'discord.js'
import { ParseUtil } from './parseUtil'

/**
 * The main, singleton Bot class.
 */
export class Bot {
    botToken: string

    client: Discord.Client

    /**
     * @throws When `new Discord.Client()` throws.
     */
    constructor(botToken: string | undefined) {
        // Initialize with info.
        if (botToken === undefined) {
            throw Error(`Invalid botToken '${botToken}'.'`)
        } else {
            this.botToken = botToken
        }
        // Create the Discord API wrapper client.
        this.client = new Discord.Client()

        this.client.on('ready', this.handleReady)
        this.client.on('message', this.handleMessage)
    }

    // === Callable Methods ===

    /**
     * Login to Discord.
     *
     * @throws When the bot is unable to login to Discord.
     */
    login(): void {
        this.client.login(process.env.BOT_TOKEN).then(() => console.log(`Bot logged into server.`))
    }

    // === Handlers ===

    private handleReady(): void {
        console.log('Ready!')
    }

    private async handleMessage(msg: Message): Promise<void> {
        if (ParseUtil.isInvocation(msg)) {
            if (msg.channel.type === 'text') {
                console.log(`(#${msg.channel.name}) ${msg.author.username}: "${msg.content}"`)
                console.log(ParseUtil.getInvocation(msg))
            }
        }
    }
}
