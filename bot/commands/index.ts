import * as globby from 'globby'
import { normalize, resolve } from 'path'
import slash = require('slash')
import { uniq, flatten, map, mergeAll, pipe as ramdaPipe } from 'ramda'
const pipe = <any>ramdaPipe

import { FullCommand } from '../models/command'

// ——————

const dirname = slash(__dirname)  // Convert Windows slashes to Unix slashes
const options: globby.GlobbyOptions = {
    onlyFiles: true,
    absolute: true,
};

export const commandFiles = uniq(
    flatten([
        // globby.sync(`${__dirname}/*(!(index.js))`, options),
        globby.sync(`${dirname}/*/index.js`, options),
        globby.sync(`${dirname}/*/*/index.js`, options),
        globby.sync(`${dirname}/*(!(special))/*.js`, options)
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

// console.log({ postCommands })
console.log({ commands: Object.keys(postCommands) })

// Exporting

export default postCommands