import * as Discord from "discord.js"

export type MessageIntent = {
  hasIntent: boolean,
  
  msg: Discord.Message,
  content: string,
  verb: string,
  tokens: string[],
}