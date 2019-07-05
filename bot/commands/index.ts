import * as globby from 'globby'
import { uniq, flatten, map, mergeAll, pipe as ramdaPipe } from 'ramda'
const pipe = <any>ramdaPipe

import { FullCommand } from '../models/command'

// ——————

const options: globby.GlobbyOptions = {
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

const help = createHelpCommand(basicCommands) 
let commands = {
    ...basicCommands,
    help: help,
    commands: help 
}

// Aliasing

let postCommands = {
    ...commands
}

Object.values(basicCommands)
    .filter(cmd => (cmd as FullCommand).aliases)
    // Insert command as value for all corresponding aliases
    .forEach(cmd => {
        const aliases = flatten([(cmd as FullCommand).aliases])
        aliases.forEach(alias => postCommands[alias] = cmd)
    })

console.log({ postCommands })

export default postCommands