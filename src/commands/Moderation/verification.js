const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ruleverify')
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
            .setTitle('**Rule Verification**')
            .setDescription(`**Rules:**\n**1. Please respect all members of the server, especially staff.**\n*- When staff tells you to stop doing something, you stop, even if it's not in the rules.*\n\n **2. You must abide with Epic Games and Discord Terms of Service.**\n\n**3. Death/DDoS/Dox Threats are strictly prohibited and will result in a permanent ban from the server, even as a joke.**\n*- Do not ask people for personal information, do not reveal personal information about someone without their consent/permission. This is considered Doxing.*\n\n**4. Do not ask for gifts, codes, skins, accounts, money, etc.**\n\n**5. Minimodding is NOT ALLOWED.**\n\n**6. Do not impersonate Scout, Staff Members, Friends, Content Creators, Bots.**\n\n**7. Do not ping Scout, Managers, Friends, SHDW, or Creators.**\n*- Additionally, do not excessively ping the staff for no reason.*\n\n**8. Please use channels for their intended purpose.**\n\n**9. Advertising is only allowed within the ┃promo channel once you reach level 10.**\n*-This is for advertising your social media content. Advertising other discord servers, other creator codes, giveaways, payment platforms, fashion shows, or clan recruitment is not allowed.*\n\n**10. Swearing is not permitted at all. Offensive chat is also not permitted.**\n\n**11. Do not spam.**\n\n**12. Do not undermine the spirit of this server or its staff members.**\n\n**13. NSFW/NSFL material is not allowed within the server.**\n*-Any kind of sexual content, dating requests, gore, violence, etc is absolutely prohibited,-This also includes controversial topics, such as religion, politics etc.*\n\n*By joining this server, you agree to abide by everything in this channel. (Members under 13 are not allowed). Be sure to avoid age related conversations to avoid this issue.*\n\n *__You are responsible for being aware of these rules. Rules can be changed at any moment and is your responsibility to know them. Full discretion is up to mods and/or staff.__*\n\n*Agree to **RULES** to access server.*`)
            .setImage('https://media.discordapp.net/attachments/1025963648457379855/1042202418923978772/Untitled-Artwork_4.png?width=552&height=552')

        const verifyBTN = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('verification')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Primary)
            )

        channel.send({ embeds: [verify], components: [verifyBTN] })
    }
}