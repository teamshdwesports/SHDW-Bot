const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('This command bans a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The member to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Write your reason here')
                .setRequired(true)
        ),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'You cant ban people', ephemeral: true})

        let reason = interaction.options.getString('reason')
        if(!reason) reason = 'No reason'
        let user = interaction.options.getUser('user')

        const embed = new EmbedBuilder()
        .setTitle(`${user.tag} was banned`)
        .setDescription(`Reason: ${reason}`)

        await interaction.reply({ embeds: [embed] });

        const DMembed = new EmbedBuilder()
        .setTitle(`You have been banned from ${interaction.guild.name}`)
        .setDescription(`Reason: ${reason}`)

        await user.send({embeds: [DMembed]}).catch(error => console.log(error))
        interaction.guild.members.ban(user, { reason: [reason] })
    }
}