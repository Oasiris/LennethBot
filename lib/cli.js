"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CLI_COMMANDS = {
    info: ({ bot, logger }) => {
        console.log("Guild info:");
        const guilds = Array.from(bot.guilds.values());
        if (!guilds.length) {
            console.log("No guilds.");
        }
        else if (guilds.length < 10) {
            guilds.forEach(guild => {
                const { name, memberCount } = guild;
                console.log(` - "${name}" (${memberCount} members)`);
            });
        }
        else {
            console.log(`${guilds.length} guilds`);
        }
        // console.log('Guilds', bot.guilds)
    },
    hello: ({ logger }) => {
        console.log("Hi!");
    },
    sendChannel: ({ bot, logger, tokens, msg }) => {
    },
};
// === CLI ===
function createDataHandler(bot, logger) {
    return function handleData(bufferData) {
        logger.verbose("CLI data input");
        const data = String(bufferData);
        const tokens = tokenize(data);
        // logger.verbose({ data })
        logger.verbose(tokenize(data));
        const commands = mapKeys(CLI_COMMANDS, toLowercase);
        const validActions = Object.keys(commands);
        const [command] = tokens;
        if (validActions.includes(command)) {
            commands[command]({
                bot,
                logger,
                tokens,
                msg: data
            });
        }
        else {
            // Do nothing
        }
    };
}
/**
 * @returns stdin socket.
 */
function startCli(bot, logger) {
    const stdin = process.openStdin();
    const handleData = createDataHandler(bot, logger);
    stdin.addListener('data', handleData);
    logger.info("CLI started");
    return stdin;
}
exports.startCli = startCli;
// === Helpers ===
function tokenize(str) {
    return str.trim().split(/\s+/).map(s => s.trim());
}
function getTokenSuffix(tokens, tokenStartIndex) {
    return tokens.slice(tokenStartIndex).join(' ');
}
/**
 * Maps a function over an object's properties and returns the result as a new object.
 */
function mapKeys(obj, fn) {
    const newObj = {};
    Object.keys(obj).map(key => {
        const value = obj[key];
        newObj[fn(key)] = value;
    });
    return newObj;
}
function toLowercase(string) { return string.toLowerCase(); }
// This should only be called once the bot is ready
// function startCli(bot, logger) {
//     // handleData needs to access bot and
//     function handleData(bufferData) {
//         const stringData = String(bufferData)
//         const tokens = tokenize(data)
//     }
//     const stdin = process.openStdin()
//     stdin.addListener('data', handleData)
// }
// module.exports = startCli
