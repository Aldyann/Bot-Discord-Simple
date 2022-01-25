const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Untuk mengubah volume antrian lagu server",
    usage: "[volume]",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("Maaf, tetapi Anda harus menggunakan saluran suara untuk memutar musik!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Tidak ada yang bermain di server ini.", message.channel);
    if (!args[0])return message.channel.send(`Volume saat ini adalah: **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send(':notes: Hanya angka-angka!').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('Anda tidak dapat mengatur volume lebih dari 150. atau lebih rendah dari 0',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .setDescription(`Saya mengatur volume ke: **${args[0]/1}/100**`)
    .setAuthor("Manajer Volume Server", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("#00ffff")
    return message.channel.send(xd);
  },
};
