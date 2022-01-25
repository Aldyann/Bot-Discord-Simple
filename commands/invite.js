const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "invite",
    description: "Untuk menambahkan/mengundang bot ke server Anda",
    usage: "",
    aliases: ["inv"],
  },

  run: async function (client, message, args) {
    
    //set the permissions id here (https://discordapi.com/permissions.html)
    
    let invite = new MessageEmbed()
    .setAuthor(`INVITE ${client.user.username.toUpperCase()}`, client.user.displayAvatarURL())
    .setDescription(`**HEY TERIMA KASIH TELAH MENUNJUKKAN MINAT KEPADA ${client.user.username.toUpperCase()} BOT. BOT INI MENAWARKAN MUSIK BERKUALITAS TINGGI DAN INI BENAR-BENAR BEBAS BIAYA JIKA ANDA BERPIKIR UNTUK MENGUNDANG BOT INI JADI JANGAN Tunda MENGUNDANG BOT!!\n[INVITE ${client.user.username.toUpperCase()}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)\n**\n\nJOIN OUR **[CULVERINE](https://discord.gg/culverine)**`)
    .setColor("#00ffff")
    return message.channel.send(invite);
  },
};
