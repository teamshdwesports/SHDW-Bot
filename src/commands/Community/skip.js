//skip slash command so that it skips the current song and playes next one
const { SlashCommandBuilder } = require(`@discordjs/builders`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`skip`)
    .setDescription(`Skips the current song`),
  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply(`No Songs Are Currently Playing`);
    const { channel } = interaction.member.voice;
    if (!channel)
      return interaction.reply(`You need to be in a voice channel.`);
    if (channel.id !== player.voiceChannel)
      return interaction.reply(`You're not in the same voice channel.`);
    const song = player.queue.current;
    player.stop();
    return interaction.reply(`Skipped **${song.title}**`);
  },
};
