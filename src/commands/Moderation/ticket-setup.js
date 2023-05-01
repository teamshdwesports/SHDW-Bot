const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ChannelType, StringSelectMenuBuilder} = require("discord.js");
const ticketSchema = require('../../Schemas.js/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket-set')
    .setDescription(`This sets up the ticket system`)
    .addChannelOption(option => option.setName('channel').setDescription(`The channel you want to send the ticket message in`).addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addChannelOption(option => option.setName('category').setDescription(`The category you want the tickets to be sent in`).addChannelTypes(ChannelType.GuildCategory).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You must have admin to setup tickets", ephemeral: true})

        const channel = interaction.options.getChannel('channel')
        const category = interaction.options.getChannel('category')

        ticketSchema.findOne({ Guild: interaction.guild.id}, async (err,data) => {

            if (!data) {
                ticketSchema.create({
                    Guild: interaction.guild.id,
                    Channel: category.id,
                    Ticket: 'first'
                })
            } else {
                await interaction.reply({ content: "You already have a ticket message set up. Use /ticket-disable to remove and restart it"})
                return;
            }
            
            const embed = new EmbedBuilder()
        .setTitle(`Ticket System`)
        .setDescription(`If you have a problem, open a ticket to talk to staff members`)
        .setFooter({ text: `${interaction.guild.name} tickets`})

        const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('select')
            .setMaxValues(1)
            .setPlaceholder(`Select a topic...`)
            .addOptions(
                {
                    label: 'General Support',
                    value: 'Subject: General Support'
                },
                {
                    label: 'Moderation Support',
                    value: 'Subject: Moderation Support'
                },
                {
                    label: 'Server Support',
                    value: 'Subject: Server Support'
                },
                {
                    label: 'Other',
                    value: 'Subject: Other'
                },
            )
        )

        await channel.send({ embeds: [embed], components: [menu]});
        await interaction.reply({ content: `Your ticket system has been set up in ${channel}`, ephemeral: true})

        })

        


    }

}