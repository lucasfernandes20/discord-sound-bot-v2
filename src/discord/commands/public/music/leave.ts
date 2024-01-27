import { ApplicationCommandType } from "discord.js";
import { Command } from "@/discord/base";

import {
  VoiceConnection,
  VoiceConnectionStatus,
  getVoiceConnection,
  getVoiceConnections,
} from "@discordjs/voice";
import { brBuilder } from "@magicyan/discord";

export default new Command({
  name: "leave",
  description: "Leave a channel",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  run(interaction) {
    // ChatInputCommandInteraction
    const { member } = interaction;

    const voiceChannel = member?.voice.channel;

    if (!voiceChannel) {
      return interaction.reply(
        "It was not possible to leave because you were not in a voice channel."
      );
    }

    const connection = getVoiceConnection(member.guild.id);

    if (!connection) {
      return interaction.reply("Osvado is not in your voice channel.");
    }

    getVoiceConnection(member.guild.id)?.destroy();
    return interaction.reply({
      content: brBuilder("Osvaldo has disconnected"),
    });
  },
});
