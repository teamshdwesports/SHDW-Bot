const { ChannelType, ButtonStyle, ButtonBuilder, ActionRowBuilder, TextInputStyle, ModalBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, TextInputBuilder, PermissionFlagsBits, AuditLogEvent } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, Object.keys(GatewayIntentBits)] });
const YoutubePoster = require("discord-youtube"); // npm i discord-youtube

client.ytp = new YoutubePoster(client, {
    loop_delay_in_min: 1
});

  module.exports = client;

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

// ACTIVITIES //

client.on('ready', () => {
    const activities = [
        
      { name: `/help`, type: 0 }, // LISTENING
      
          { name: `The Team SHDW Discord Server`, type: 2 }, // PLAYING
          { name: `Team SHDW's Users`, type: 3 }, // WATCHING
      ];
      const status = [
          'online'
      ];
      let i = 0;
      setInterval(() => {
          if(i >= activities.length) i = 0
          client.user.setActivity(activities[i])
          i++;
      }, 5000);
    
      let s = 0;
      setInterval(() => {
          if(s >= activities.length) s = 0
          client.user.setStatus(status[s])
          s++;
      }, 10000);
  });

  // SHDW FORM SUBMISSION //

  client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;
  
    if (interaction.customId === 'modal') {
      const ingameusername = interaction.fields.getTextInputValue('ingameusername');
      const aboutyou = interaction.fields.getTextInputValue('aboutyou');
      const whyshdw = interaction.fields.getTextInputValue('whyshdw');
      const priorteam = interaction.fields.getTextInputValue('priorteam');
      const gametheyplay = interaction.fields.getTextInputValue('gametheyplay');
  
      const dmEmbed = new EmbedBuilder()
        .addFields({ name: `${interaction.user.username}'s SHDW Sub form`, value: `${ingameusername}`})
        .addFields({ name: "About", value: `${aboutyou}` })
        .addFields({ name: "Why Team member", value: `${whyshdw}` })
        .addFields({ name: "Prior Experience", value: `${priorteam}` })
        .addFields({ name: "The game they want to play", value: `${gametheyplay}` })
  
      const me = client.users.cache.get("718718225000693760")
  
      me.send({ embeds: [dmEmbed] })
      await interaction.reply({ content: 'Your form has been submitted.', ephemeral: true })
    }
  })

// TICKETS //
  
const ticketSchema = require('./Schemas.js/ticketSchema');
client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isButton()) return;
    if (interaction.isChatInputCommand()) return;

    const ticketmodal = new ModalBuilder()
    .setTitle('Provide us with more info')
    .setCustomId('ticketmodal')

    const email = new TextInputBuilder()
    .setCustomId('email')
    .setRequired(true)
    .setLabel('Provide us with your email')
    .setPlaceholder(`You must provide a valid email`)
    .setStyle(TextInputStyle.Short)

    const username = new TextInputBuilder()
    .setCustomId('username')
    .setRequired(true)
    .setLabel('Provide us with your username')
    .setPlaceholder(`This is your username`)
    .setStyle(TextInputStyle.Short)

    const reason = new TextInputBuilder()
    .setCustomId('reason')
    .setRequired(true)
    .setLabel('The reason for this ticket')
    .setPlaceholder(`Give us a reason for opening this ticket`)
    .setStyle(TextInputStyle.Paragraph)

    const firstActionRow = new ActionRowBuilder().addComponents(email)
    const secondActionRow = new ActionRowBuilder().addComponents(username)
    const thirdActionRow = new ActionRowBuilder().addComponents(reason)
    
    ticketmodal.addComponents(firstActionRow, secondActionRow, thirdActionRow)
    let choices;
    if (interaction.isStringSelectMenu()) {

        choices = interaction.values;

        const result = choices.join('');

        ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            const filter = {Guild: interaction.guild.id};
            const update = {Ticket: result};

            ticketSchema.updateOne(filter, update, {
                new: true
            }).then(value => {
                console.log(value)
            })
        })
    }

    if (!interaction.isModalSubmit()) {
        interaction.showModal(ticketmodal)
    }
})

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isModalSubmit()) {

        if (interaction.customId === 'ticketmodal') {

            ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

                const emailInput = interaction.fields.getTextInputValue('email')
                const usernameInput = interaction.fields.getTextInputValue('username')
                const reasonInput = interaction.fields.getTextInputValue('reason')

                const postChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
                if (postChannel) return await interaction.reply({ content: `You already have a ticket open - ${postChannel}`, ephemeral: true});

                const category = data.Channel;

                const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Ticket`)
                .setDescription(` Welcome to your ticket! Please wait while staff review your info`)
                .addFields({ name: `Email`, value: `${emailInput}`})
                .addFields({ name: `Username`, value: `${usernameInput}`})
                .addFields({ name: `Reason`, value: `${reasonInput}`})
                .addFields({ name: `Type`, value: `${data.Ticket}`})
                .setFooter({ text: `${interaction.guild.name} tickets`})

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('ticketbutton')
                    .setLabel(`Close Ticket`)
                    .setStyle(ButtonStyle.Danger)
                )


                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.tag}`,
                    type: ChannelType.GuildText,
                    parent: `${category}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: interaction.user,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                })

                let msg = await channel.send({ embeds: [embed], components: [button]});
                await interaction.reply({ content: `Your ticket has been opened in ${channel}`, ephemeral: true});

                const collector = msg.createMessageComponentCollector()

                collector.on('collect', async i => {
                    ;(await channel).delete();


                    const dmEmbed = new EmbedBuilder()
                    .setTitle(`Your ticket has been closed`)
                    .setDescription(`Thanks for contacting us! If you need anything else, feel free to open another one`)
                    .setFooter({ text: `${interaction.guild.name} tickets`})
                    .setTimestamp()

                    await interaction.member.send({ embeds: [dmEmbed]}).catch (err => {
                        return;
                    })

                })

            })
        }
    }
})

// VC JOIN //

const voiceChannelId = '1078228949005508648'; // Replace  voice channel ID

const targetChannelId = '1071308683306356806'; // Replace channel ID





client.on('voiceStateUpdate', async (oldState, newState) => {

  // Check if the user has joined the target voice channel

  if (newState.channel?.id === voiceChannelId) {

    

    const targetChannel = newState.guild.channels.cache.get(targetChannelId);

    

    

    if (targetChannel && !targetChannel.permissionsFor(newState.member).has('ViewChannel')) {

     

      await targetChannel.permissionOverwrites.create(newState.member, { ViewChannel: true });

    }

  } else if (oldState.channel?.id === voiceChannelId) {

    

    const targetChannel = oldState.guild.channels.cache.get(targetChannelId);

    

    

    if (targetChannel && targetChannel.permissionsFor(oldState.member).has('ViewChannel')) {

      

      await targetChannel.permissionOverwrites.delete(oldState.member);

    }

  }

});

// LEVEL SYSTEM //

const levelSchema = require("./Schemas.js/level");
client.on(Events.MessageCreate, async (message) => {


  const { guild, author } = message;

  if (!guild  || author.bot) return;

  levelSchema.findOne({ Guild: guild.id, User: author.id}, async (err, data) => {

    if (err) throw err;

    if (!data) {
      levelSchema.create({
        Guild: guild.id,
        User: author.id,
        XP: 0,
        Level: 0
      })
    }
  })

  const channel = message.channel;

  const give = 1;

  const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});

  if (!data) return;

  const requiredXP = data.Level * data.Level * 20 + 20;

  if (data.XP + give >= requiredXP) {

    data.XP += give;
    data.Level += 1;
    await data.save();

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setDescription(`${author}, you have reached ${data.Level}!`)

    channel.send({ embeds: [embed] })
  } else {
    data.XP += give;
    data.save()
  }
})

// JOIN TO CREATE SYSTEM //

const joinschema = require('./Schemas.js/jointocreate');
const joinchannelschema = require('./Schemas.js/jointocreatechannels');

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

  try {
      if (newState.member.guild === null) return;
  } catch (err) {
      return;
  }

  if (newState.member.id === '1076798263098880116') return;

  const joindata = await joinschema.findOne({ Guild: newState.member.guild.id });
  const joinchanneldata1 = await joinchannelschema.findOne({ Guild: newState.member.guild.id, User: newState.member.id });

  const voicechannel = newState.channel;

  if (!joindata) return;

  if (!voicechannel) return;
  else {

      if (voicechannel.id === joindata.Channel) {

          if (joinchanneldata1) {
              
              try {

                  const joinfail = new EmbedBuilder()
                  .setTimestamp()
                  .setAuthor({ name: `🔊 Join to Create System`})
                  .setFooter({ text: `🔊 Issue Faced`})
                  .setTitle('> You tried creating a \n> voice channel but..')
                  .addFields({ name: `• Error Occured`, value: `> You already have a voice channel \n> open at the moment.`})

                  return await newState.member.send({ embeds: [joinfail] });
                } catch (err) {
                  return;
              }

          } else {

              try {

                  const channel = await newState.member.guild.channels.create({
                      type: ChannelType.GuildVoice,
                      name: `${newState.member.user.username}-room`,
                      userLimit: joindata.VoiceLimit,
                      parent: joindata.Category
                  })
                  
                  try {
                      await newState.member.voice.setChannel(channel.id);
                  } catch (err) {
                      console.log('Error moving member to the new channel!')
                  }   

                  setTimeout(() => {

                      joinchannelschema.create({
                          Guild: newState.member.guild.id,
                          Channel: channel.id,
                          User: newState.member.id
                      })

                  }, 500)
                  
              } catch (err) {

                  console.log(err)

                  try {

                      const joinfail = new EmbedBuilder()
                      .setTimestamp()
                      .setAuthor({ name: `🔊 Join to Create System`})
                      .setFooter({ text: `🔊 Issue Faced`})
                      .setTitle('> You tried creating a \n> voice channel but..')
                      .addFields({ name: `• Error Occured`, value: `> I could not create your channel, \n> perhaps I am missing some permissions.`})
  
                      await newState.member.send({ embeds: [joinfail] });
  
                  } catch (err) {
                      return;
                  }

                  return;

              }

              try {

                  const joinsuccess = new EmbedBuilder()
                  .setTimestamp()
                  .setAuthor({ name: `🔊 Join to Create System`})
                  .setFooter({ text: `🔊 Channel Created`})
                  .setTitle('> Channel Created')
                  .addFields({ name: `• Channel Created`, value: `> Your voice channel has been \n> created in **${newState.member.guild.name}**!`})

                  await newState.member.send({ embeds: [joinsuccess] });

              } catch (err) {
                  return;
              }
          }
      }
  }
})

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

  try {
      if (oldState.member.guild === null) return;
  } catch (err) {
      return;
  }

  if (oldState.member.id === '1076798263098880116') return;

  const leavechanneldata = await joinchannelschema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id });

  if (!leavechanneldata) return;
  else {

      const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);

      if (newState.channel === voicechannel) return;

      try {
          await voicechannel.delete()
      } catch (err) {
          return;
      }

      await joinchannelschema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id })
      try {

          const deletechannel = new EmbedBuilder()
          .setTimestamp()
          .setAuthor({ name: `🔊 Join to Create System`})
          .setFooter({ text: `🔊 Channel Deleted`})
          .setTitle('> Channel Deleted')
          .addFields({ name: `• Channel Deleted`, value: `> Your voice channel has been \n> deleted in **${newState.member.guild.name}**!`})

          await newState.member.send({ embeds: [deletechannel] });

      } catch (err) {
          return;
      } 
  }
})

// MOD LOG //

client.on(Events.ChannelCreate, async channel => {

  channel.guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelCreate,
  })
  .then(async audit => {
    const { executor } = audit.entries.first()

    const name = channel.name;
    const id = channel.id;
    let type = channel.type;

    if (type == 0) type = 'Text'
    if (type == 2) type = 'Voice'
    if (type == 13) type = 'Stage'
    if (type == 15) type = 'Form'
    if (type == 5) type = 'Announcement'
    if (type == 4) type = 'Category'

    const channelID = '1096341119027118172'
    const mChannel = await channel.guild.channels.cache.get(channelID)

    const embed = new EmbedBuilder()
    .setTitle("Channel Created")
    .addFields({ name: "Channel Name", value: `${name} {<${id}>}`, inline: false})
    .addFields({ name: "Channel Type", value: `${type}`, inline: false})
    .addFields({ name: "Channel ID", value: `${id}`, inline: false})
    .addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging System"})

    mChannel.send({ embeds: [embed]})
  })
})


client.on(Events.ChannelDelete, async channel => {

  channel.guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelDelete,
  })
  .then(async audit => {
    const { executor } = audit.entries.first()

    const name = channel.name;
    const id = channel.id;
    let type = channel.type;

    if (type == 0) type = 'Text'
    if (type == 2) type = 'Voice'
    if (type == 13) type = 'Stage'
    if (type == 15) type = 'Form'
    if (type == 5) type = 'Announcement'
    if (type == 4) type = 'Category'

    const channelID = '1096341119027118172'
    const mChannel = await channel.guild.channels.cache.get(channelID)

    const embed = new EmbedBuilder()
    .setTitle("Channel Created")
    .addFields({ name: "Channel Name", value: `${name} `, inline: false})
    .addFields({ name: "Channel Type", value: `${type}`, inline: false})
    .addFields({ name: "Channel ID", value: `${id}`, inline: false})
    .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging System"})

    mChannel.send({ embeds: [embed]})
  })
})

client.on(Events.GuildBanAdd, async member => {

  member.guild.fetchAuditLogs({
    type: AuditLogEvent.GuildBanAdd,
  })
  .then(async audit => {
    const { executor } = audit.entries.first()

    const name = member.user.username;
    const id = member.user.id;

    const channelID = '1096341119027118172'
    const mChannel = await member.guild.channels.cache.get(channelID)

    const embed = new EmbedBuilder()
    .setTitle("Member Banned")
    .addFields({ name: "Member Name", value: `${name} {<@${id}>}`, inline: false})
    .addFields({ name: "Member ID", value: `${id}`, inline: false})
    .addFields({ name: "Banned By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging System"})

    mChannel.send({ embeds: [embed]})
  })
})

client.on(Events.GuildBanRemove, async member => {

  member.guild.fetchAuditLogs({
    type: AuditLogEvent.GuildBanRemove,
  })
  .then(async audit => {
    const { executor } = audit.entries.first()

    const name = member.user.username;
    const id = member.user.id;

    const channelID = '1096341119027118172'
    const mChannel = await member.guild.channels.cache.get(channelID)

    const embed = new EmbedBuilder()
    .setTitle("Member UnBanned")
    .addFields({ name: "Member Name", value: `${name} {<@${id}>}`, inline: false})
    .addFields({ name: "Member ID", value: `${id}`, inline: false})
    .addFields({ name: "UnBanned By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging System"})

    mChannel.send({ embeds: [embed]})
  })
})

client.on(Events.MessageDelete, async message => {

  message.guild.fetchAuditLogs({
    type: AuditLogEvent.MessageDelete,
  })
  .then(async audit => {
    const { executor } = audit.entries.first()

    const mes = message.content

    if (!mes) return;

    const channelID = '1096341119027118172'
    const mChannel = await message.guild.channels.cache.get(channelID)

    const embed = new EmbedBuilder()
    .setTitle("Message Deleted")
    .addFields({ name: "Message Content", value: `${mes}`, inline: false})
    .addFields({ name: "Message Channel", value: `${message.channel}`, inline: false})
    .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging System"})

    mChannel.send({ embeds: [embed]})
  })
})

client.on(Events.MessageUpdate, async (message, newMessage) => {

  newMessage.guild.fetchAuditLogs({
    type: AuditLogEvent.MessageUpdate,
  })
  .then(async audit => {
    const { executor } = audit.entries.first()

    const mes = message.content

    if (!mes) return;

    const channelID = '1096341119027118172'
    const mChannel = await newMessage.guild.channels.cache.get(channelID)

    const embed = new EmbedBuilder()
    .setTitle("Message Edited")
    .addFields({ name: "Old Message", value: `${mes}`, inline: false})
    .addFields({ name: "New Message", value: `${newMessage}`, inline: false})
    .addFields({ name: "Edited By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: "Mod Logging System"})

    mChannel.send({ embeds: [embed]})
  })
})