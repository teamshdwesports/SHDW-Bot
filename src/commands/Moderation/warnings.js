const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField, EmbedBuilder } = require(`discord.js`);
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Gets a members warning count")
    .addUserOption(option => option.setName('user').setDescription('The user you want to check the warnings for').setRequired(true)),
    async execute (interaction) {

        const member = interaction.options.getUser('user');
        let warns = await db.get(`warns_${member}`);

        if (warns == null) warns = 0;

        const embed = new EmbedBuilder()
        .setDescription(`:white_check_mark:  ${member.tag} has **${warns}** warn(S)`)

        await interaction.reply({ embeds: [embed ]});

    }
}