const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
  .setName("report")
  .setDescription("Send an issue or bug related to SHDW's Bot or Website")

.addStringOption((option) =>
  option
      .setName("bug")
      .setDescription("The bug you found for SHDW")
      .setRequired(true)
),

  async execute ( interaction ) {

        const {client, guild} = interaction;
        const userID = interaction.user.id
        const channelsend = interaction.guild.channels.cache.get("1068762094931025981");
        const user = interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const report = interaction.options.getString(`bug`)

      await interaction.reply({
      embeds: [new EmbedBuilder()
             .setDescription(`Succesfully sent your issue in ${channelsend}`)], ephemeral: true });
          

        const embed = new EmbedBuilder()
        .setTitle("New issue in Team SHDW")
        .setDescription(`Sent by ${member}: **${report}**`)

        await interaction.reply({ embeds: [embed] })
  }
}