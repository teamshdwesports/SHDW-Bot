const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const staffschema = require('../../Schemas.js/staffrole');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('staff-role')
    .setDescription('Configure your help staff role.')
    .addSubcommand(command => command.setName('set').setDescription('Specified role will be pinged when doing /help staff.').addRoleOption(option => option.setName('staff-role').setDescription('Specified role will be your staff role.').setRequired(true)).addRoleOption(option => option.setName('staff-role2').setDescription('Specified role will be your staff role.').setRequired(true)).addRoleOption(option => option.setName('staff-role3').setDescription('Specified role will be your staff role.').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Disables the staff help system.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
            case 'set':
 
            const staffdata = await staffschema.findOne({ Guild: interaction.guild.id });
            const staffrole = await interaction.options.getRole('staff-role');
            const staffrole2 = await interaction.options.getRole('staff-role2');
            const staffrole3 = await interaction.options.getRole('staff-role3');
 
            if (!staffdata) {
 
                staffschema.create({
                    Guild: interaction.guild.id,
                    Role: staffrole.id
                })
 
                const staffenable = new EmbedBuilder()
                .setFooter({ text: `🛠 Help Staff set`})
                .setAuthor({ name: `🛠 Help Staff System`})
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/attachments/1096341119027118171/1096714799167057970/shdwlogo.png')
                .setTitle('> Staff Role set')
                .addFields({ name: `• Staff Role`, value: `> Your roles (${staffrole}, ${staffrole2}, and ${staffrole3}) have been **set** as your \n> staff helper role. They will \n> be pinged when a user needs help!`})
 
                await interaction.reply({ embeds: [staffenable]})
 
            } else {
                await interaction.reply({ content: `The **Helper Staff** system is already **enabled**. \n> Do **/staff-role remove** to undo.`, ephemeral: true})
            }
 
            break;
            case 'remove':
 
            const staffdata1 = await staffschema.findOne({ Guild: interaction.guild.id });
 
            if (!staffdata1) {
                return await interaction.reply({ content: `The **Helper Staff** system is already **disabled**, can't disable **nothing**..`, ephemeral: true});
 
            } else {
 
                await staffschema.deleteOne({ Guild: interaction.guild.id });
                await interaction.reply({ content: `Your **Helper Staff** system has been **disabled**!`, ephemeral: true});
 
            }
        }
    }
}