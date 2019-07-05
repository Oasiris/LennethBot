import { RichEmbed } from "discord.js"
import { FullCommand } from "../../models/command";

/**
 * Help 
 */

export const createHelpCommand = (commands) => {
  return function help({ say, bot }) {
    const entries = Object.entries(commands)
    const { COMMAND_PREFIX } = process.env

    const embed: Partial<RichEmbed> = new RichEmbed({
      // author: {
      //   name: bot.user.username,
      //   icon_url: bot.user.avatarURL,
      // },
      title:       `List of Commands`,
      description: `━━━━━`,
      fields: [].concat(
        entries.map(([verb, cmd]) => ({
          name: `${COMMAND_PREFIX}${verb}`,
          value: (cmd as FullCommand).description || '—'
        }))
      ),
      // timestamp: new Date(),
      footer: {
        text: "━━━━━━"
      }
    })
    embed.setColor('#ff00ff')
    
    say({ embed })
  }
}