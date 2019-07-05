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
    ping: ({ say }) => say('Pong!'),
    pong: ({ say }) => say('Ping!'),

    async: async ({ say }) => {
        say("ZZZ...")
        await Util.sleep(1000)
        say("(wakes up)")
    }

}

// export default COMMANDS
module.exports = COMMANDS