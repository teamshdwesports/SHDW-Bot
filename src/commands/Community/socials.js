const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()

    .setName("socials")

    .setDescription("View the Socials of my Creator!"),

    /**

     * @param {ChatInputCommandInteraction} interaction 

     * @param {Client} client 

     */

    async execute(interaction, client) {

        

        const Response = new EmbedBuilder()

        .setTitle("Socials")

        .setDescription(

        `[Youtube](https://www.youtube.com/channel/UCJkkvmJw33e9c6TbdH0eVkQ)\n  [Website](https://teamshdw.carrd.co)`)

        .setTimestamp(Date.now())


        .setThumbnail('https://cdn.discordapp.com/attachments/1025963649052967005/1055649984843878521/Scout_V3.png')
 .setImage('https://cdn.discordapp.com/attachments/1025963648457379855/1042202418923978772/Untitled-Artwork_4.png')
        
        interaction.reply({embeds: [Response]})

    }

}