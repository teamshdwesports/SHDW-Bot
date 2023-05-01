const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, client } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
  .setName("uptime")
  .setDescription("Replies with the bot uptime"),
  /**
  *
  * @param {ChatInputCommandInteraction} interaction
*/
  execute(interaction, client) {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 23
      let minutes = Math.floor(client.uptime / 60000) % 60
    let seconds = Math.floor(client.uptime / 1000) % 60
    const embed = new EmbedBuilder()
    .setTitle("Uptime")      
    .setThumbnail("https://cdn3.emoji.gg/emojis/2769-cowrollultrafast.gif%22")
    .setDescription(`My uptime is ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
    interaction.reply({ embeds: [embed]})
  }
}