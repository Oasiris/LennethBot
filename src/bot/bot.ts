import Discord, { Message } from 'discord.js'
import { ParseUtil } from './parseUtil'

/**
 * The main, singleton Bot class.
 */
export class Bot {
    /** Singleton instance. */
    private static _instance: Bot

    /** Get an instance of a Bot object. */
    static get instance(): Bot {
        if (!Bot._instance) {
            Bot._instance = new Bot(process.env.BOT_TOKEN)
        }
        return this._instance
    }

    botToken: string
    client: Discord.Client

    // TODO: Instantiate a class "PokecardScraper" here, which is just an Express app under the
    // hood. Pass it into every invokedCommand.run call.

    /**
     * @throws When `new Discord.Client()` throws.
     */
    private constructor(botToken: string | undefined) {
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
    public login(): void {
        this.client.login(process.env.BOT_TOKEN).then(() => console.log(`Bot logged into server.`))
    }

    // === Handlers ===

    /** Log when ready. */
    private handleReady(): void {
        console.log('Ready!')
    }

    /** Receive, parse, and respond to a message from a user. */
    private async handleMessage(msg: Message): Promise<void> {
        if (ParseUtil.isInvocation(msg)) {
            // Log the invocation to terminal.
            const invocation = ParseUtil.getInvocation(msg)
            if (msg.channel.type === 'text') {
                console.log(`(#${msg.channel.name}) ${msg.author.username}: "${msg.content}"`)
                console.log(invocation)
            }
            // Fulfill the invocation.
            const invokedCommand = ParseUtil.canFulfill(invocation)
            if (invokedCommand !== null) {
                invokedCommand.run({ bot: this, invocation })
            }
        }
    }
}
