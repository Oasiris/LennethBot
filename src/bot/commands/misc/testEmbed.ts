import Discord = require('discord.js')

const commands = {
    testEmbed1: {
        description: "Used to test bot's Rich Embed.",
        effect: ({ say }) => {
            say({
                embed: {
                    color: 3447003,
                    description: "A very simple Embed!"
                }
            })
        },
        aliases: ['testEmbedOne']
    },
    
    testEmbed2: ({ say, bot }) => {
        say({
            embed: {
                color: 3447003,
                author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                },
                title: "This is an embed",
                url: "http://google.com",
                description: "This is a test embed to showcase what they look like and what they can do.",
                fields: [
                    {
                        name: "Fields",
                        value: "They can have different fields with small headlines."
                    }, {
                        name: "Masked links",
                        value: "You can put [masked links](http://google.com) inside of rich embeds."
                    }, {
                        name: "Markdown",
                        value: "You can put all the *usual* **__Markdown__** inside of them."
                    }
                ], 
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "© Example"
                }
            }
        })
    },

    testEmbed3: ({ say, bot }) => {
        const newEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addField('Regular field title', 'Some value here')
            .addBlankField()
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png')

        say(newEmbed)

    }
}
module.exports = commands
