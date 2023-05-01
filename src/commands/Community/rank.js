const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const levelSchema = require('../../Schemas.js/level');
const Canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Gets a members rank in the server')
    .addUserOption(option => option.setName('user').setDescription('The member you want the rank of').setRequired(false)),
    async execute (interaction) {

        const { options, user, guild } = interaction;

        const Member = options.getMember('user') || user;
        
        const member = guild.members.cache.get(Member.id);

        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id});

        const embed = new EmbedBuilder()
        .setDescription(`:white_check_mark:  ${member} has not gained any XP yet`)

        if (!Data) return await interaction.reply({ embeds: [embed] });

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 20 + 20;

        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ forseSatic: true}))
        .setBackground("IMAGE", 'https://media.discordapp.net/attachments/1072716347303264276/1072717150541860914/20230101_221330.png?width=809&height=394')
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, "Rank", false)
        .setLevel(Data.Level, "Level")
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)

        const Card = await rank.build();

        const attachment = new AttachmentBuilder(Card, { name: "rank.png"});

        const embed2 = new EmbedBuilder()
        .setTitle(`${member.user.username}'s Level/Rank`)

        await interaction.editReply({ embeds: [embed2], files: [attachment]});

    }
}