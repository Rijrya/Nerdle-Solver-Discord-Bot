// Simplicity V2 discord bot

import { GuildMember } from "discord.js";

// master branch
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { Collection } = require("discord.js");

const ytdl = require("ytdl-core");
const fs = require("fs");
const ms = require('ms');
let slogChannel, jlogChannel, mlogChannel;
const client = new Discord.Client({ fetchAllMembers: true });
client.commands = new Collection();
const prefix = "./"

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const cfile of commandFiles) {
    const cmd = require(`./commands/${cfile}`);
    client.commands.set(cmd.name, cmd);
}





function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const findMember = (arg: string, mem: GuildMember) => {
    if (!mem) return;
    let guild = mem.guild
    let toReturn;

    guild.members.cache.each(member => {
        if (member.displayName.includes(arg) || member.user.username.includes(arg)) {
            toReturn = member
            return member
        }
    })

    return toReturn
}


client.on('message', async msg => {
    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();
        const cmdFile = client.commands.get(cmd) || client.commands.find(cf => cf.aliases && cf.aliases.includes(cmd));
        const target = msg.mentions.members.first() || findMember(args[0], msg.member)
        

        if (cmd === "nerd") {

            let filter = m => m.author.id === msg.author.id
    msg.channel.send(`Are you sure to delete all data? \`YES\` / \`NO\``).then(() => {
      msg.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })})}
         else {
        //console.log('starting', cmd);
        //client.commands.forEach(thing => console.log(thing))
        if (!cmdFile) {
            msg.channel.send(new MessageEmbed().setDescription("Invalid command!").setColor([255, 0, 0]))
            return;
        };
        //console.log('found file');
        if (cmdFile.args && !args.length) {
            msg.channel.send(new MessageEmbed().setDescription(cmdFile.description).setColor([255, 0, 0]));
            return;
        }
        //console.log('has args');
        if (cmdFile.targeted && !target) {
            msg.channel.send(new MessageEmbed().setDescription("This command expected a target, but you didn't specify one.").setColor([255, 0, 0]));
            return;
        }

        if (cmdFile.hierarchical && msg.member != msg.guild.owner && target && target.roles.highest.position >= msg.member.roles.highest.position) {
            msg.channel.send(new MessageEmbed().setDescription(`You cannot do this to <@${target.user.id}>.`).setColor([255, 0, 0]));
            return;
        }
        //console.log('target valid');
        if (cmdFile.guildOnly === true && !msg.channel.guild) {
            msg.channel.send(new MessageEmbed().setDescription("Sorry, this command only works in servers!").setColor([255, 0 ,0]));
            return;
        }

        if (cmdFile.concatAfter != undefined) {
            let cca = parseFloat(cmdFile.concatAfter);
            let tocc = args.slice(cca);
            args.splice(cca);
            let newArray = args.push(tocc.toString().replace(/,/g, " "));
        }

        if (!cmdFile.selfAllowed && target === msg.member) {
            msg.channel.send(new MessageEmbed().setDescription("You can't do that to yourself!").setColor([255, 0 ,0]));
            return;
        }

        if (cmdFile.permsNeeded) {
            const permsHas = msg.channel.permissionsFor(msg.author);

            if (!permsHas || !permsHas.has(cmdFile.permsNeeded)) {
                msg.channel.send(new MessageEmbed().setDescription(`You don't have permission to do this! Missing ${cmdFile.permsNeeded}.`).setColor([255, 0, 0]));
                return;
            }
        }
        //console.log('done in guild');
        // if (cmdFile.permLevel > 0) {
        //     const roles = msg.member.roles
        //     if (cmdFile.permLevel === 1) {
        //         if (!roles.cache.some(role => role.name.toLowerCase().search("mod") !== -1)  && !roles.cache.some(role => role.name.toLowerCase().search("admin") !== -1)) {
        //             msg.channel.send(new MessageEmbed().setDescription("You don't have permission to do this!").setColor([255, 0, 0]));
        //             return;
        //         }
        //     } else if (cmdFile.permLevel === 2) {
        //         if (!roles.cache.some(role => role.name.toLowerCase().search("admin") !== -1)) {
        //             msg.channel.send(new MessageEmbed().setDescription("You don't have permission to do this!").setColor([255, 0, 0]));
        //             return;
        //         }
        //     } else if (cmdFile.permLevel === 3) {
        //         if (msg.guild.owner != msg.member) {
        //             msg.channel.send(new MessageEmbed().setDescription("You don't have permission to do this!").setColor([255, 0, 0]));
        //             return;
        //         }
        //     } else if (cmdFile.permLevel === 4) {
        //         if (msg.author.id != '168704403400949761' && msg.author.id != '215558097530388481') {
        //             msg.channel.send(new MessageEmbed().setDescription("You don't have permission to do this!").setColor([255, 0, 0]));
        //             return;
        //         }
        //     }
        // }



        //console.log('has perms');
        try {
            cmdFile.main(msg, args, target, [], client.commands, client.guilds, [getRandomInt(1, 255), getRandomInt(1, 255), getRandomInt(1, 255)]);
        } catch (err) {
            console.log(err);
            msg.channel.send(new MessageEmbed().setDescription("An unexpected error occurred!"));
        }
    }
}
})

client.on('ready', () => {
    client.channels.fetch('1020772563045077045').then(channel => slogChannel = channel)

    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: "online",
        activity: {
            name: `./help`,
            type: "WATCHING"
        }
    });
});


/*
setInterval(async () => {
    const struct = await mutes.get("mutes")

    if (struct) {
        for (const cobj in struct) {
            console.log('cobj')
            for (const tobj in cobj) {
                const start = tobj[0];
                const duration = tobj[1];
                const cid = tobj[2];
                const uid = tobj[3];

                if (!start) {
                    console.log('invalid start')
                    return;
                } else if (!duration) {
                    console.log('invalid duration')
                    return;
                } else if (!cid) {
                    console.log('invalid cid')
                    return;
                } else if (!uid) {
                    console.log('invalid uid')
                    return;
                }

                console.log(`checking ${uid}`);
                if (Date.now() - start >= duration) {
                    console.log('mute is up')
                    const channel = client.channels.fetch(cid);

                    if (channel) {
                        channel.overwritePermissions([
                            {
                                id: uid,
                                allow: ["SEND_MESSAGES"]
                            }
                        ])

                        msg.channel.send(new MessageEmbed().setColor([0, 255, 0]).setDescription(`<@${uid}> is no longer muted.`));
                    } else {
                        console.log("Invalid mute channel!")
                    }
                }
            }
        }
    } else {
        console.log("no struct!");
    }
}, 1000)
*/
/*
command file example:

const { MessageEmbed } = require("discord.js")

module.exports = {
    name: `help`,
    description: `Displays information about the bot and it's commands.`,
    guildOnly: true,
    args: false,
    selfAllowed: false,
    permLevel: 0,
    targeted: false,
    aliases: ["h"],
    concatAfter: undefined,
    permsNeeded: "",
    async main(msg, args, target, mutes, commands, guilds, ksoft, clr) {

    }
}
*/



// // logging
client.on('channelCreate', c => {
    if (!slogChannel) return;
    slogChannel.send(new MessageEmbed()
        .setColor([0, 255, 0])
        .setTitle("Channel Created")
        .setAuthor(c.guild.name, c.guild.iconURL({format:'png'}))
        .setDescription(`<#${c.id}> was created in \`${c.guild.name}\``)
    )
})

client.on('channelDelete', c => {
    if (!slogChannel) return;
    slogChannel.send(new MessageEmbed()
        .setColor([255, 0, 0])
        .setTitle("Channel Deleted")
        .setAuthor(c.guild.name, c.guild.iconURL({format:'png'}))
        .setDescription(`${c.name} was deleted in \`${c.guild.name}\``)
    )
})

client.on('guildCreate', g => {
    if (!jlogChannel) return;
    jlogChannel.send(new MessageEmbed()
        .setColor([0, 255, 0])
        .setTitle("Server Joined")
        .setAuthor(g.name, g.iconURL({format:'png'}))
        .setDescription(`Bot has joined \`${g.name}\`.`)
    )
})

client.on('guildDelete', g => {
    if (!jlogChannel) return;
    jlogChannel.send(new MessageEmbed()
        .setColor([255, 0 , 0])
        .setTitle("Server Left")
        .setAuthor(g.name, g.iconURL({format:'png'}))
        .setDescription(`Bot has left \`${g.name}\`.`)
    )
})

client.on('messageDelete', m => {
    if (!mlogChannel) return;
    if (!m.author) return;
    mlogChannel.send(new MessageEmbed()
        .setColor([255, 0, 0])
        .setTitle("Message Deleted")
        .setAuthor(m.author.tag, m.author.avatarURL({format:'png'}))
        .setDescription(`${m.content}\n\nDeleted in <#${m.channel.id}>`)
        .setFooter(m.guild.name, m.guild.iconURL({format:'png'}))
    )
})

client.on('messageUpdate', (m, newm) => {
    if (!mlogChannel) return;
    if (!m.author) return;
    mlogChannel.send(new MessageEmbed()
        .setColor([255, 255, 0])
        .setTitle("Message Edited")
        .setAuthor(m.author.tag, m.author.avatarURL({format:'png'}))
        .setDescription(`Before:\n${m.content}\n\nAfter:\n${newm.content}\n\nEdited in <#${m.channel.id}>`)
        .setFooter(m.guild.name, m.guild.iconURL({format:'png'}))
    )
})
