import { RichEmbed } from "discord.js"
import { FullCommand } from "../../models/command"

export const alias = ['commands']

/**
 * Returns a function-command `help` which, when triggered, will print a
 * helpful message.
 * 
 * @param commands An object whose values are either FullCommands or 
 *    functions representing simple function-commands.
 */
export function createHelpCommand(
  commands: { [key: string]: FullCommand | any }
) {
  return help

  /**
   * Fuck yeah.
   */
  function help({ say, bot }) {
    const commandEntries = Object.entries(commands)
    const cmdHelpFields = commandEntries
    .filter(([verb, cmd]) => {
      return !(cmd as FullCommand).unlisted
    })
    .map(([verb, cmd]) => {
      return {
        name: process.env.COMMAND_PREFIX + verb,
        // If the cmd is a FullCommand, display its description
        value: (cmd as FullCommand).description || '—'
      }
    })

    const embed: Partial<RichEmbed> = new RichEmbed({
      title:       `List of Commands`,
      description: `━━━━━`,
      fields: cmdHelpFields,
      footer: { text: "━━━━━━" }
    })
    embed.setColor('#ff00ff')
    
    say({ embed })
  }
}