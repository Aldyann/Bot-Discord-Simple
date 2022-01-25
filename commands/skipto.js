const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "jump",
    description: "Melompati ke nomor antrian yang dipilih",
    usage: "skipto <number>",
    aliases: ["st", "jump"],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
                        embed: {
                            color: "YELLOW",
                            description: `**Usage**: \`${client.config.prefix}skipto <number>\``
                        }
                   }).catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("Tidak ada antrian.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Antriannya hanya ${queue.songs.length} Lagu panjang!`,message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return sendError(`:notes: Pemain telah berhenti dan antrian telah dihapus.: ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: "#00FFFF",
                            description: `${message.author} ⏭ Melewati \`${args[0] - 1}\` lagu`
                        }
   
                   }).catch(console.error);
                   message.react("✅")

  },
};
