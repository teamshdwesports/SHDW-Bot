const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ChannelType, StringSelectMenuBuilder} = require("discord.js");
const ticketSchema = require('../../Schemas.js/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket-disable')
    .setDescription(`This disables the ticket system`),
    async execute (interaction) {
    
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You must have admin to setup tickets", ephemeral: true})

        ticketSchema.deleteMany({ Guild: interaction.guild.id}, async (err, data) => {
            await interaction.reply({ content: "Your ticket syestem has been removed", ephemeral: true})
        })
        

    }

}