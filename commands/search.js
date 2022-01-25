const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const YouTube = require("youtube-sr");
const sendError = require("../util/error")
const fs = require('fs');

module.exports = {
  info: {
    name: "search",
    description: "Untuk mencari lagu :D",
    usage: "<song_name>",
    aliases: ["sc"],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)return sendError("Maaf, tetapi Anda harus menggunakan saluran suara untuk memutar musik!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Saya tidak dapat terhubung ke saluran suara Anda, pastikan saya memiliki izin yang tepat!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Saya tidak dapat berbicara di saluran suara ini, pastikan saya memiliki izin yang tepat!", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Anda tidak ingin saya ingin mencari", message.channel);

    var serverQueue = message.client.queue.get(message.guild.id);
    try {
           var searched = await YouTube.search(searchString, { limit: 10 });
          if (searched[0] == undefined)return sendError("Sepertinya saya tidak dapat menemukan lagu di YouTube", message.channel);
                    let index = 0;
                    let embedPlay = new MessageEmbed()
                        .setColor("#00ffff")
                        .setAuthor(`Hasil untuk \"${args.join(" ")}\"`, message.author.displayAvatarURL())
                        .setDescription(`${searched.map(video2 => `**\`${++index}\`  |** [\`${video2.title}\`](${video2.url}) - \`${video2.durationFormatted}\``).join("\n")}`)
                        .setFooter("Ketik nomor lagu untuk menambahkannya ke daftar putar");
                    // eslint-disable-next-line max-depth
                    message.channel.send(embedPlay).then(m => m.delete({
                        timeout: 15000
                    }))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send({
                            embed: {
                                color: "RED",
                                description: "Tidak ada yang dipilih dalam 20 detik, permintaan telah dibatalkan."
                            }
                        });
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await (searched[videoIndex - 1])
		    
                } catch (err) {
                    console.error(err);
                    return message.channel.send({
                        embed: {
                            color: "RED",
                            description: "🆘  **|**  Saya tidak dapat memperoleh hasil pencarian apa pun"
                        }
                    });
                }
            
            response.delete();
  var songInfo = video

    const song = {
      id: songInfo.id,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      ago: songInfo.uploadedAt,
      duration: songInfo.durationFormatted,
      url: `https://www.youtube.com/watch?v=${songInfo.id}`,
      img: songInfo.thumbnail.url,
      req: message.author
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
      .setAuthor("MENAMBAHKAN KE ANTREAN")
      .setThumbnail(song.img)
      .setColor("YELLOW")
      .setDescription(`[${song.title}](${song.url})`)
      .setFooter(song.duration)
      return message.channel.send(thing);
    }

   const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 100,
      playing: true,
      loop: false
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
       if (!afk[message.guild.id]) afk[message.guild.id] = {
        afk: false,
    };
    var online = afk[message.guild.id]
    if (!song){
      if (!online.afk) {
        sendError("Meninggalkan saluran suara karena saya pikir tidak ada lagu dalam antrian. Jika Anda suka bot tetap 24/7 di saluran suara run `!afk`", message.channel)
        message.guild.me.voice.channel.leave();//If you want your bot stay in vc 24/7 remove this line :D
        message.client.queue.delete(message.guild.id);
      }
            return message.client.queue.delete(message.guild.id);
}
let stream = null; 
    if (song.url.includes("youtube.com")) {
      
      stream = await ytdl(song.url);
stream.on('error', function(er)  {
      if (er) {
        if (queue) {
        queue.songs.shift();
        play(queue.songs[0]);
  	  return sendError(`Terjadi sebuah kesalahan yang tidak diharapkan.\nJenis yang mungkin \`${er}\``, message.channel)

       }
      }
    });  
}
 
    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
      const dispatcher = queue.connection
         .play(ytdl(song.url, {
           quality: 'highestaudio',
           filter: "audioonly",
           bitrate: 320,
           highWaterMark: 1 << 25,
           type: "opus",
           liveBuffer: 10000
           }))
      .on("finish", () => {
           const shiffed = queue.songs.shift();
            if (queue.loop === true) {
                queue.songs.push(shiffed);
            };
          play(queue.songs[0]);
        })

      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      let thing = new MessageEmbed()
      .setAuthor("MEMAINKAN!")
      .setThumbnail(song.img)
      .setColor("#00FFFF")
      .setDescription(`[${song.title}](${song.url})`)
      .setFooter(song.duration)
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true)
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Saya tidak dapat bergabung dengan saluran suara: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Saya tidak dapat bergabung dengan saluran suara: ${error}`, message.channel);
    }
 
  },

};
