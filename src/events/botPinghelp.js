const { Events, EmbedBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;
    const contains = message.mentions.has(client.user) && (!message.author.bot)
    if (contains === message.content.includes("@here") || message.content.includes("@everyone") || message.reference) return false
    if (contains) message.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`Hi There I'm here to help`)
                .setDescription(` Official bot of Team SHDW. Created by SHDW Scout. Currently in progress.

                Use [/] in <#1096341119442358304> to use slash commands.`)
                .setFields(
                    {
                        name: `Got Stuck?`,
                        value: `Run </help:1096345976974884888> to get the full command list`
                    }
                    
                )
                .setFooter({ text: `Developed by SHDW Scout \n Team SHDW Esports` })
                
        ]
    })
    }
};