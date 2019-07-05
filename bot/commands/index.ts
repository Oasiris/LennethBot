import * as globby from 'globby'
import { uniq, flatten, map, mergeAll, pipe as ramdaPipe } from 'ramda'
const pipe = <any>ramdaPipe

// ——————

const options = {
    onlyFiles: true,
    absolute: true,
};

export const commandFiles = uniq(
    flatten([
        // globby.sync(`${__dirname}/*(!(index.js))`, options),
        globby.sync(`${__dirname}/*/index.js`, options),
        globby.sync(`${__dirname}/*/*/index.js`, options),
        globby.sync(`${__dirname}/*(!(special))/*.js`, options)
    ])
);

const basicCommands = pipe(
    map((filepath: string) => require(filepath)),
    mergeAll,
)(commandFiles)

// === Special commands ===

import { createHelpCommand } from './special/help'

let commands = {
    ...basicCommands,
    help: createHelpCommand(basicCommands)
}

console.log({ commandFiles, commands })

export default commands