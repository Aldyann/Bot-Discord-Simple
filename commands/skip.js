const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skip",
    description: "Untuk melewati musik saat ini",
    usage: "",
    aliases: ["s"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("Maaf, tetapi Anda harus menggunakan saluran suara untuk memutar musik!", message.channel);
   if (channel.id !== message.guild.me.voice.channel.id) return message.reply({
      embed: {
        color: "RED",
        description: "Saya tidak ada di saluran suara Anda!"
      }
    }).catch(console.error); 
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("Tidak ada permainan yang bisa saya lewati untuk Anda.", message.channel);
        if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ Melanjutkan musik untuk Anda!")
      .setColor("YELLOW")
      .setTitle("Musik telah Dilanjutkan!")
       
   return message.channel.send(xd).catch(err => console.log(err));
      
    }


       try{
      serverQueue.connection.dispatcher.end()
      } catch (error) {
        serverQueue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Pemain telah berhenti dan antrian telah dihapus.: ${error}`, message.channel);
      }
    message.react("✅")
  },
};
