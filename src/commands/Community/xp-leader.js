const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const levelSchema = require('../../Schemas.js/level');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp-leaderboard')
        .setDescription("Gets the server's xp leaderboard"),
        async execute(interaction) {

        const { guild, client } = interaction;

        let text = "";

        const embed1 = new EmbedBuilder()
            .setDescription(':white_check_mark: No one is on the leaderboard yet...');

        const Data = await levelSchema.find({ Guild: guild.id })
            .sort({
                XP: -1,
                Level: -1,
            })
            .limit(10);

        if (!Data) return await interaction.reply({ embeds: [embed1] });
        
        await interaction.deferReply();

        for (let counter = 0; counter < Data.length; ++counter) {

            let { User, XP, Level } = Data[counter];

            const value = await client.users.fetch(User) || "Unknown Member"

            const member = value.tag;

            text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level}\n`
        

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "XP Leaderboard"});

        await interaction.editReply({ embeds: [embed] })
    }
}
}