const { Client, Collection, MessageEmbed } = require("discord.js");
const sendError = require("../util/error")
const createBar = require("string-progressbar");

module.exports = {
  info: {
    name: "nowplaying",
    description: "Untuk menampilkan musik yang sedang diputar di server ini",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Tidak ada yang diputar di server ini.", message.channel);
    let song = serverQueue.songs[0]

    let thing = new MessageEmbed()
      .setAuthor("Memainkan!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("#00ffff")
      .addField("Nama", `[${song.title}](${song.url})`, true)
      .addField("Durasi", song.duration, true)
      .addField("Request dari", song.req, true)
      .setFooter(`Views: ${song.views} | Ago: ${song.ago}`)
        return message.channel.send(thing)
   }
};
