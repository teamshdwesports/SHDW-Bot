const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const staffschema = require('../../Schemas.js/staffrole');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('staff-help')
    .setDescription('Ping for help!'),
    async execute(interaction) {
 
 
 
            const staffdata = await staffschema.findOne({ Guild: interaction.guild.id });
            
 
            if(!staffdata) {
                return await interaction.reply({ content: `This **feature** has not been **set up** in this server yet!`, ephemeral: true})
            } else {
 
                const staffembed = new EmbedBuilder()
                .setTimestamp()
                .setTitle('> Pinged some staff')
                .setDescription('You will be assisted shortly!')
 
                const staffrole = staffdata.Role;
                const memberslist = await interaction.guild.roles.cache.get(staffrole).members.filter(member => member.presence?.status !== 'offline').map(m => m.user).join('\n> ');
                if (!memberslist) {
                    const embed = new EmbedBuilder()
                    .setTimestamp()
                    .setTitle('> No Staff Available')
                    .setDescription('There are **no** staff available **at the moment**! Try again later..')
                    interaction.reply({ embeds: [embed] })
                    } else {
                        const staffembed = new EmbedBuilder()
                        .setTimestamp()
                        .setTitle('> Pinged some staff')
                        .setDescription('You will be assisted shortly!')
                        await interaction.reply({ content: `> ${memberslist}`, embeds: [staffembed]})
                    }
 
            } 
    }
}