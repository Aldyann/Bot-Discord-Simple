require('array.prototype.move');

module.exports = {
  info: {
    name: "move",
    description: "Pindahkan lagu dalam antrean.",
    usage: "<queue> <number>",
    aliases: ["mv"],
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
    if (!serverQueue)return sendError("Tidak ada permainan yang bisa saya pindahkan untuk Anda.", message.channel);

    if (!args.length) return message.reply(`Usage: ${message.client.config.prefix}move <Queue Number>`);
    if (isNaN(args[0])) return message.reply(`Usage: ${message.client.config.prefix}move <Queue Number>`);

    let songMoved = serverQueue.songs[args[0] - 1];

    serverQueue.songs.move(args[0] - 1, 1);
    serverQueue.textChannel.send({
      embed: {
        color: "#00FFFF",
        titlr: `**Berpindah:** ${songMoved.title}`
      }
    });
  }
};