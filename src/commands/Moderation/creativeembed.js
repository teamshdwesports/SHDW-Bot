const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creative')
    .setDescription("Replys with Team SHDW's Creative Codes")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

      const embed = new EmbedBuilder()
      .setDescription(`> The Official SHDW Map Code List
> --------------------
> 
> SHDW MAPS 
> ===============
> 1v1 FFA    6860-6753-5004   (Updated v4)
> Box Fight FFA         TBA
> Go Goated 8785-5567-4700 (Updated v6)
> Parkour City          TBA
> SHDW Hub              TBA
> 
> BRAND MAPS `)

      await interaction.reply({ embeds: [embed] })
    }
}