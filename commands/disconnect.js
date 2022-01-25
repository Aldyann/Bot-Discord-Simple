const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "disconnect",
    description: "Untuk memutuskan sambungan bot dari voice channel",
    usage: "",
    aliases: ["dc", "leave"],
  },

  run: async function (client, message, args) { 
         const { channel } = message.member.voice; 
         const serverQueue = message.client.queue.get(message.guild.id); 
         if (!channel) return message.reply({
               embed: {
                 color: "RED",
                 title: "Anda harus bergabung dengan saluran suara terlebih dahulu!"
               }
             }).catch(console.error); 
         if (!message.guild.me.voice.channel) return message.reply({
               embed: {
                 color: "RED",
                 title: "Saya tidak berada di voice channel!"
               }
             }).catch(console.error); 
         if (channel.id !== message.guild.me.voice.channel.id) return message.reply({
               embed: {
                 color: "RED",
                 title: "Saya tidak berada di voice channel!"
               }
             }).catch(console.error); 
         if(serverQueue) { 
             serverQueue.connection.dispatcher.destroy(); 
             channel.leave(); 
             message.client.queue.delete(message.guild.id); 
             serverQueue.textChannel.send({
               embed: {
                 color: "#00FFFF",
                 title: "👋 **|** Saya telah meninggalkan saluran. Dadahhhh Gaes."
               }
             }).catch(console.error); 
             return 
            }
            channel.leave(); 
            
    message.client.queue.delete(message.guild.id); 
    message.channel.send({
               embed: {
                 color: "#00FFFF",
                 title: "👋 **|** Saya telah meninggalkan saluran. Dadahhhh Gaes."
               }
             }).catch(console.error); 
    } 
    
 };