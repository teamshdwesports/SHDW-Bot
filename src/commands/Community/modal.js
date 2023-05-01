const {  SlashCommandBuilder } = require(`@discordjs/builders`);
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shdwsub")
    .setDescription("This is a form to send to the bot"),
    async execute(interaction) {

        const modal = new ModalBuilder()
  .setCustomId("modal")
  .setTitle("Team SHDW Submission Form")
    .setComponents(
      new ActionRowBuilder()
        .setComponents(
          new TextInputBuilder()
            .setLabel("Provide us your discord and in game name")
            .setCustomId("ingameusername")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Your username in game you play and discord")
            .setRequired(true)),
      new ActionRowBuilder()
        .setComponents(
          new TextInputBuilder()
            .setLabel("Provide some info/details about you")
            .setCustomId("aboutyou")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Info about you")
            .setRequired(true)),
      new ActionRowBuilder()
        .setComponents(
          new TextInputBuilder()
            .setLabel("Why do you want to be a SHDW member?")
            .setCustomId("whyshdw")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Explain in detail why")
            .setRequired(true)),
         new ActionRowBuilder()
        .setComponents(
          new TextInputBuilder()
            .setLabel("Do you have any prior team experience?")
            .setCustomId("priorteam")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Your prior experience")
            .setRequired(true)),
            new ActionRowBuilder()
        .setComponents(
          new TextInputBuilder()
            .setLabel("What game will you play for SHDW?")
            .setCustomId("gametheyplay")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("The game you'll play")
            .setRequired(true)))

 await interaction.showModal(modal)
    }
}