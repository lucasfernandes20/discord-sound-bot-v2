import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "@/discord/base";
import {
  brBuilder,
  createEmbedAuthor,
  createRow,
  hexToRgb,
} from "@magicyan/discord";
import { settings } from "@/settings";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import ytdl from "ytdl-core";

export default new Command({
  name: "play",
  description: "Play a music",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "youtube",
      description: "Use external URL from Youtube",
      type: ApplicationCommandOptionType.String,
    },
  ],
  async run(interaction) {
    // ChatInputCommandInteraction
    const { channel, options, user, member } = interaction;
    const voiceChannel = member?.voice.channel;

    if (!channel?.isTextBased()) {
      return interaction.reply(
        "Is not possible to use /play command in this channel."
      );
    }

    if (!voiceChannel) {
      return interaction.reply(
        "It was not possible to use the command /play because you were not in a voice channel."
      );
    }

    const musicPlayer = options.getString("youtube", true);
    const video = musicPlayer.split("/watch");
    const formattedUrl = `https://www.youtube.com/watch${video}`;

    if (!ytdl.validateURL(formattedUrl)) {
      interaction.reply(
        brBuilder("The following youtube URL don't exists:", formattedUrl)
      );
    }

    const youtubeVideoInformations = await ytdl.getInfo(formattedUrl);

    const embed = new EmbedBuilder({
      author: createEmbedAuthor({ user }),
      color: hexToRgb(settings.colors.theme.success),
      thumbnail: youtubeVideoInformations.videoDetails.thumbnails[0],
      title: `Play ${youtubeVideoInformations.videoDetails.title} ?`,
      description: brBuilder(
        `_${youtubeVideoInformations.videoDetails.author.name}_`,
        "- If you want to play this music on current voice channel, pess bellow button",
        "- If you do not want to play, ignore this Embed"
      ),
      footer: {
        text: "Click bellow button to start",
        iconURL:
          "https://img.freepik.com/vetores-premium/logo-vermelho-do-youtube-logo-de-midia-social_197792-1803.jpg",
      },
    });

    const button = new ButtonBuilder({
      customId: "play-button",
      label: "Play",
      style: ButtonStyle.Success,
    });

    const row = createRow(button);

    const reply = await interaction.reply({
      ephemeral: false,
      embeds: [embed],
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10_000,
    });

    const disableButton = () => {
      button.setDisabled(true);
      reply.edit({
        components: [row],
      });
    };

    collector.on("collect", (interaction) => {
      if (interaction.customId === "play-button") {
        const player = createAudioPlayer();
        const voiceConnection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guildId,
          selfMute: false,
          selfDeaf: true,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        voiceConnection.subscribe(player);
        const stream = ytdl(formattedUrl, {
          filter: "audioonly",
          highWaterMark: 1 << 62,
          liveBuffer: 1 << 62,
          dlChunkSize: 0, //disabling chunking is recommended in discord bot
          quality: "lowestaudio",
        });

        stream.on("error", (err) => console.error(err));

        const resourse = createAudioResource(stream);
        player.play(resourse);
        player.on("stateChange", (oldState, newState) => {
          if (newState.status === "idle") voiceConnection.destroy();
        });
        disableButton();
        return;
      }
    });

    collector.on("end", () => {
      disableButton();
    });
  },
});
