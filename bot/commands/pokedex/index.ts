import * as Pokedex from 'pokedex-promise-v2'
import { FullCommand } from '../../models/command'

const P = new Pokedex()
const { getPokemonByName } = P

const COMMANDS: { [key: string]: Partial<FullCommand> } = {}

COMMANDS.pokedex = {
  description: "Shows general information on a given Pokemon species.",
  aliases: ['pokemon', 'dex'],
  params: [
    [1, 'identifier', true],
    [2, 'detail', false, 'Amount of detail to return.']
  ],
}

COMMANDS.pokedex.effect = async ({ say, tokens }) => {
  say("Coming soon!")
}


// const commands = {
//   pokedex: {
//     usage: "<Pokemon name OR National Dex number>",
//     aliases: ['pokemon', 'dex'],
//     args: [
//       [1, 'identifier']
//     ],
//     effect: async ({ say, tokens }) => {
//       let pkmn
//       try {
//         pkmn = await getPokemonByName('eevee')
//       } catch (err) {
//         console.error(err)
//       }
//       say(JSON.stringify(pkmn).slice(0, 2000))
//       // say("Yeah")
      
//     }
//   }
// }


module.exports = COMMANDS