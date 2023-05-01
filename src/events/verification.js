const { Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'verification') {
                const role = interaction.guild.roles.cache.get('1096341118213423171')
                interaction.member.roles.add(role)
                
                const DMembed = new EmbedBuilder()
                    .setTitle(`Verified`)
                    .setDescription(`You have now been verified, enjoy the server :)`)
                    .setFooter({ text: `Welcome` })
                    .setTimestamp()
                interaction.reply({ embeds: [DMembed], ephemeral: true })
            }
        }
    }
}