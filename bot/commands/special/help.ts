import { RichEmbed } from "discord.js"

/**
 * Help 
 */

export const createHelpCommand = (commands) => {
  return function help({ say, bot }) {
    const verbs = Object.keys(commands)
    const { COMMAND_PREFIX } = process.env

    const embed: Partial<RichEmbed> = new RichEmbed({
      // author: {
      //   name: bot.user.username,
      //   icon_url: bot.user.avatarURL,
      // },
      title:       `List of Commands`,
      description: `━━━━━`,
      fields: [].concat(
        verbs.map(verb => ({
          name: `${COMMAND_PREFIX}${verb}`,
          value: "Default text"
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