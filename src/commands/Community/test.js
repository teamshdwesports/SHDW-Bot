const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('This is the testcommand!'),
    async execute(interaction, client ) {
       await interaction.reply({ content: 'The bot is working!' });
    }
}