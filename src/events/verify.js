const { Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'verify') {
                const role = interaction.guild.roles.cache.get('1096341118213423168')
                interaction.member.roles.add(role)
                
                const DMembed = new EmbedBuilder()
                    .setTitle(`Verified`)
                    .setDescription(`You have now been verified, see the rules :)`)
                    .setFooter({ text: `Rules` })
                    .setTimestamp()
                interaction.reply({ embeds: [DMembed], ephemeral: true })
            }
        }
    }
}