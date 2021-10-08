import Discord from 'discord.js'

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
    }

    /**
     * Login to Discord.
     * 
     * @throws When the bot is unable to login to Discord.
     */
    login(): void {
        this.client.login(process.env.BOT_TOKEN)
            .then(() => console.log(`Bot logged into server.`))
    }


}
