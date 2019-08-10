/**
 * Command exporter.
 * Compiles basic commands from subdirectories, generates meta-commands like "help", and exports.
 */

import globby = require('globby')
import path = require('path')
import {
    clone,
    flatten,
    map,
    mergeAll,
    pipe,
    uniq,
} from 'ramda'
import slash = require('slash')

import { FullCommand, CommandBank} from '../models/command'
import { Glob } from '../models/glob'

/* Constants */

const DIRNAME = slash(__dirname)  // Convert Windows slashes to Unix slashes
const COMMAND_GLOBS: Glob[] = [
    `${DIRNAME}/*/index.js`,
    `${DIRNAME}/*/*/index.js`,
    `${DIRNAME}/*(!(special))/*.js`,
]

/* Get commands */

let basicCommands: CommandBank
{
    const getPathsFromGlobs: (globs: Glob[]) => string[] =
        pipe(
            map((glob: string) => globby.sync(glob, globbyOptions)),
            flatten,
            uniq,
        )

    const getCommandBankFromPaths: (paths: string[]) => CommandBank =
        pipe(
            map((filepath: string) => require(filepath)),
            mergeAll,
        )

    const globbyOptions: globby.GlobbyOptions = {
        onlyFiles: true,
        absolute: true,
    }

    const commandFilePaths = getPathsFromGlobs(COMMAND_GLOBS)
    basicCommands = getCommandBankFromPaths(commandFilePaths)
}

/* Get special commands */

import { createHelpCommand } from './special/help'

const help = createHelpCommand(basicCommands)
const commands: CommandBank = {
    ...clone(basicCommands),
    help: help,
    commands: help
}

// Aliasing
{
    Object.values(basicCommands)
        .filter(cmd => (cmd as FullCommand).aliases)
        // Insert command as value for all corresponding aliases
        .forEach(cmd => {
            const aliases = flatten([(cmd as FullCommand).aliases])
            aliases.forEach(alias => commands[alias] = cmd)
        })
}

// console.log({ postCommands })
console.log({ commands: Object.keys(commands) })

// Exporting

export default commands
