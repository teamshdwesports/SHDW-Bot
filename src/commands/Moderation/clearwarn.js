const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField, EmbedBuilder } = require(`discord.js`);
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clearwarn")
    .setDescription("Clears a members warning count")
    .addUserOption(option => option.setName('user').setDescription('The user you want to clear warnings for').setRequired(true))
    .addNumberOption(option => option.setName('number').setDescription('The number of warnings you want to clear').setRequired(true)),
    async execute (interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "You don't have permissions to execute this command", ephermeral: true })

        const member = interaction.options.getUser('user');
        const warnNum = interaction.options.getNumber('number');

        let warns = await db.get(`warns_${member}`);
        if (warns == null) warns = 0;

        if (warnNum > warns) return await interaction.reply({ content: `You can only clear a max of ${warns} warning(s) from ${member.tag}`, ephemeral: true});

        let afwarns = await db.sub(`warns_${member}`, warnNum);

        const embed = new EmbedBuilder()
        .setDescription(`:white_check_mark:  ${member.tag} now has ${afwarns} warn(s)`)

        await interaction.reply({ embeds: [embed ]});

    }
}