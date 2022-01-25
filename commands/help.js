const { MessageEmbed } = require('discord.js')

module.exports = {
    info: {
        name: "help",
        description: "Untuk Menampilkan Semua Commands",
        usage: "[command]",
        aliases: ["commands", "help me", "pls help"]
    },

    run: async function(client, message, args){
       var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd.info
            allcmds+="`"+cmdinfo.name+""+"`, "+""
        })

        let embed = new MessageEmbed()
        .setTitle("Commands")
        .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true}))
        .setColor("#00ffff")
        .setDescription(`\n${allcmds}\n\nJika mengalami bug atau kendala harap hubungi **[Starnbitch](https://discord.com/users/500965309084073994/)**\n`)
        
        .setFooter(`Untuk mendapatkan info dari setiap Commands yang dapat Anda lakukan ${client.config.prefix}help [command]\nCrated by yannJg.`)

        if(!args[0])return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))
            if(!command)return message.channel.send("Command tidak di temukan")
            let commandinfo = new MessageEmbed()
            .setTitle("Command: "+command.info.name+" info")
            .setColor("YELLOW")
            .setDescription(`
Name: ${command.info.name}
Description: ${command.info.description}
Usage: \`${client.config.prefix}${command.info.name} ${command.info.usage}\`
Aliases: ${command.info.aliases.join(", ")}
`)
            message.channel.send(commandinfo)
        }
    }
}
