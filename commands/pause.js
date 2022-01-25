const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "pause",
    description: "Untuk menjeda musik saat ini di server",
    usage: "[pause]",
    aliases: ["pause"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Pemain telah berhenti dan antrian telah dihapus.: ${error}`, message.channel);
      }	    
      let xd = new MessageEmbed()
      .setTitle("⏸ **|** Menjeda musik untuk Anda!")
      .setColor("YELLOW")
      return message.channel.send(xd);
    }
    return sendError("Tidak ada yang bermain di server ini.", message.channel);
  },
};
