import { Util } from '../../util/util'

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
    ping: {
        description: '',
        unlisted: true,
        effect: ({ say }) => say('Pong!'),
    },
    pong: {
        description: '',
        unlisted: true,
        effect: ({ say }) => say('Ping!'),
    },

    async: async ({ say }) => {
        say("ZZZ...")
        await Util.sleep(1000)
        say("(wakes up)")
    },



    about: {
        description: 'Learn more about Lenneth, the valkyrie bot.',
        effect: ({ say }) => {
            say(`Hi! I'm Lenneth.
    I'm a gaming Discord bot, and I'm currently under development. Type "${process.env.COMMAND_PREFIX}help" to see a list of commands.
    In my free time, I search for suitable souls in Midgard to become my Einherjar, to fight alongside the Aesir to help prevent Ragnarok.
    My favorite hobby is long walks in flower meadows.`)
        }
    }

}

// export default COMMANDS
module.exports = COMMANDS