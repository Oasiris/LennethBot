import { GuildMember, Message, User } from 'discord.js'

/**
 * ReplyUtil is a utility class for formatting and delivering messages to
 * text channels.
 */
export class ReplyUtil {
    /**
     * @returns That user's mention.
     */
    static getMention(author: User | GuildMember): string {
        return author.toString()
    }
}
