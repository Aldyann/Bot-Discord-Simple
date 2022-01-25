const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "stop",
    description: "Untuk menghentikan musik dan membersihkan antrian",
    usage: "",
    aliases: [],
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
    if (!serverQueue)return sendError("Tidak ada permainan yang bisa saya hentikan untuk Anda.", message.channel);
   if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     try{
      serverQueue.connection.dispatcher.end();
      } catch (error) {
        message.guild.me.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Pemain telah berhenti dan antrian telah dihapus.: ${error}`, message.channel);
      }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react("✅")
  },
};