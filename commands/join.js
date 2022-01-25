const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "join",
    description: "Bergabung dengan saluran suara Anda",
    usage: "",
    aliases: ["j"],
  },

  run: async function (client, message, args) {
  const voiceChannel = message.member.voice.channel;
		 if (!voiceChannel) return message.reply('Silakan masukkan saluran suara terlebih dahulu.');

     let channel = message.member.voice.channel;
     const permissions = channel.permissionsFor(message.client.user);

     if (!permissions.has("CONNECT"))return sendError("Saya tidak dapat terhubung ke saluran suara Anda, pastikan saya memiliki izin yang tepat!", message.channel);
     if (!permissions.has("SPEAK"))return sendError("Saya tidak dapat berbicara di saluran suara ini, pastikan saya memiliki izin yang tepat!", message.channel);
     if (!permissions.has("VIEW_CHANNEL"))return sendError("Saya tidak memiliki izin untuk melihat saluran Anda, pastikan saya memiliki izin yang tepat!")

  	if (client.voice.connections.has(voiceChannel.guild.id)) {
		return message.reply({
      embed: {
        color:"RED",
        title: 'Saya sudah berada di Voice Channel.'
      }
    });
      }
   	await voiceChannel.join();
	 	return message.reply({
       embed: {
         color: "#00ffff",
        title: `Bergabung **${voiceChannel.name}**!`
       }
     });

	 }
};