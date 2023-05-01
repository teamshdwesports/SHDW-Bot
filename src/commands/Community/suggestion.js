const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
  .setName("suggest")
  .setDescription("Suggest something to SHDW's Bot or Website")

.addStringOption((option) =>
  option
      .setName("suggestion")
      .setDescription("Your suggestion for SHDW, also send an explanation")
      .setRequired(true)
),

  async execute ( interaction ) {

        const {client, guild} = interaction;
        const userID = interaction.user.id
        const channelsend = interaction.guild.channels.cache.get("1096341119442358310");
        const user = interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const suggestion = interaction.options.getString(`suggestion`)

      await interaction.reply({
      embeds: [new EmbedBuilder()
             .setDescription(`Succesfully sent your suggestion in ${channelsend}`)], ephemeral: true });
          

        const embed = new EmbedBuilder()
        .setTitle("New idea for Team SHDW")
        .setDescription(`Sent by ${member}: **${suggestion}**`)


        channelsend.send({ embeds: [embed] })
  }
}