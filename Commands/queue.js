const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows the first 10 songs in the queue."),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(Interaction.guild);
    
        if(!queue || !queue.playing) {
            await interaction.reply("There is no song playing.");
            return;
        }

        const queueString = queue.tracks.slice(0,10.).map((song, i) => {
            return `${i + 1})  [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentsong = queue.current;

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing:**\n\` ${currentsong.title} - <@${currentsong.requestedBy.id}>\n\n**Queue:**\n${queueString}`) 
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}