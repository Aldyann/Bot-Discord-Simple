const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const yts = require("yt-search");
const fs = require('fs');
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "play",
    description: "Untuk memutar lagu :D",
    usage: "<YouTube_URL> | <song_name>",
    aliases: ["p"],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)return sendError("Maaf, tetapi Anda harus menggunakan saluran suara untuk memutar musik!", message.channel);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))return sendError("Saya tidak dapat terhubung ke saluran suara Anda, pastikan saya memiliki izin yang tepat!", message.channel);
    if (!permissions.has("SPEAK"))return sendError("Saya tidak dapat berbicara di saluran suara ini, pastikan saya memiliki izin yang tepat!", message.channel);

    var searchString = args.join(" ");
    if (!searchString)return sendError("Anda tidak ingin saya ingin bermain", message.channel);
   	const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    
   var serverQueue = message.client.queue.get(message.guild.id);
    
     let songInfo = null;
    let song = null;
    if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
       try {
          songInfo = await ytdl.getInfo(url)
          if(!songInfo)return sendError("Sepertinya saya tidak dapat menemukan lagu di YouTube", message.channel);
        song = {
       id: songInfo.videoDetails.videoId,
       title: songInfo.videoDetails.title,
       url: songInfo.videoDetails.video_url,
       img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
      duration: songInfo.videoDetails.lengthSeconds,
      ago: songInfo.videoDetails.publishDate,
      views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
      req: message.author

        };

      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }else {
      try {
        var searched = await yts.search(searchString);
    if(searched.videos.length === 0)return sendError("Sepertinya saya tidak dapat menemukan lagu di YouTube", message.channel)
    
     songInfo = searched.videos[0]
        song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
      .setAuthor("MENAMBAHKAN KE DALAM ANTREAN!")
      .setThumbnail(song.img)
      .setColor("YELLOW")
      .setDescription(`[${song.title}](${song.url}) [${song.req}]`)
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
        sendError("Meninggalkan saluran suara karena saya pikir tidak ada lagu dalam antrian. Jika Anda suka bot tetap 24/7 di saluran suara run`!afk`\n\nMakasih gaes telah menggunakan saya!!", message.channel)
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
           filter: 'audioonly',
           bitrate: 320 ,
           quality: "highestaudio",
           highWaterMark: 1 << 25 ,
           liveBuffer: 10000,
           type: "opus"
           }
        ))
         .on("finish", () => {
           const shiffed = queue.songs.shift();
            if (queue.loop === true) {
                queue.songs.push(shiffed);
            };
          play(queue.songs[0])
        })

      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      let thing = new MessageEmbed()
      .setAuthor("MEMAINKAN!")
      .setThumbnail(song.img)
      .setColor("#00ffff")
      .setDescription(`[${song.title}](${song.url}) [${song.req}]`)
      .setFooter(`${song.duration}`)
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Saya tidak dapat bergabung dengan saluran suara: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(`Saya tidak dapat bergabung dengan saluran suara: ${error}`, message.channel);
    }
  },
};
