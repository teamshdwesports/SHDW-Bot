const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement to a specific channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName('channel').setDescription('The channel where you want it to go').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role you want to @').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('Title of the embed').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message contents of the announcement').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image of the embed (not required)').setRequired(false)),
    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel('channel');
        const role = options.getRole('role');
        const title = options.getString('title');
        const message = options.getString('message');
        const colour = options.getString('colour') || "Black";
        const image = options.getString('image') || null;

        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`${message}`)
            .setImage(image)

        await channel.send({ embeds: [embed], content: `${role}` })
        await interaction.reply({ content: `Announcement sent to ${channel}`, ephemeral: true })
    }
}