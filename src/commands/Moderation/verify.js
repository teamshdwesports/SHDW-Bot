const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('verify user')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('verify channel')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.user.id.includes('1091513721605599342')) return interaction.reply({ content:`You can not use this command`, ephemeral: true })

        const channel = interaction.options.getChannel('channel')

        const verify = new EmbedBuilder()
            .setTitle('**Welcome Verification**')
            .setDescription('**Welcome to the Official Team SHDW Discord Server.** \n**Information:** SHDW Scout built this organization from the ground up. On October 1st, 2022 he came up with a team, Team SHDW. Scout also has his own coded bot especially for this server. This bot, SHDW Bot, can assist you with any thing you need. We also have a website, https://teamshdwesports.wixsite.com/teamshdwesports, and you can find things you need there. Please use <#1096341119442358310> if you have any suggestions to add to the bot or website.\n**Explanation of the Server:** This place here is not only a place to hang out with the fans of our team, but also a place where you can part of our team too. In this server we will host custom matches that you can be involved in, a level up system to give you a goal, and last, but not least, a great experience.\nEnjoy your stay and stay involved with Team SHDW.\nIf you need help please use our help desk.\nPlease mark down below that you have read the **Welcome** to access rules.')
            .setImage('https://media.discordapp.net/attachments/1025963648457379855/1042202418923978772/Untitled-Artwork_4.png?width=552&height=552')

        const verifyBTN = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('verify')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Primary)
            )

        channel.send({ embeds: [verify], components: [verifyBTN] })
    }
}