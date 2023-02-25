const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
    .setname("play")
    .setDescription("Plays a song")
    .addSubCommand(subcommand => {
        subcommand
            .setName("search")
            .setDescription("searches for a song.")
            .addStringOption(option => 
                option
                    .setname("searchterms")
                    .setDescription("search keywords")
                    .setRequired(true)
                )
    })
    .addSubCommand(subcommand => {
        subcommand
            .setname("playlist")
            .setDescription("Plays playlist from YT")
            .addStringOption(option => 
                option
                    .setName("url")
                    .setDescription("playlist url")
                    .setRequired(true)
            )
    })
    .addSubCommand(subcommand =>
        subcommand
            .setname("song")
            .setDescription("Plays a song from YT")
            .addStringOption(option =>
                option
                    .setname("url")
                    .setDescription("url of the song")
                    .setRequired(true)
            )
            ),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel1)
        {
            await interaction.reply("bsdk voice me ja pehle");
            return;
        }

        const queue = await client.player.createQueue(interation.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed();
        if(interaction.options.getSubcommand() === "song")
        {
            let url = interaction.options.getString("url");
            
            const result = await client.player.search(url,{
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });
        
            if (result.tracks.length === 0)
            {
                await interaction.reply("no results found");
                return
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});

        }
        else if(interaction.options.getSubcommand() === "playlist")
        {
            let url = interaction.options.getString("url");
            
            const result = await client.player.search(url,{
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });
        
            if (result.tracks.length === 0)
            {
                await interaction.reply("no results found");
                return
            }

            const playlist = result.playlist;
            await queue.addTrack(playlist);

            embed
                .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Duration: ${playlist.duration}`});
        }
        else if(interaction.options.getSubcommand() === "search")
        {
            let url = interaction.options.getString("serachterms");
            
            const result = await client.player.search(url,{
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });
        
            if (result.tracks.length === 0)
            {
                await interaction.reply("no results found");
                return
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        }

        if(!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })
    }    
}        