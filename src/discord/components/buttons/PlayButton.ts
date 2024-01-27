import { Component } from "@/discord/base";
import {
  AudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { ComponentType } from "discord.js";

export default new Component({
  customId: "play-button",
  type: ComponentType.Button,
  cache: "cached",
  async run(interaction) {
    const { member } = interaction;

    const voiceChannel = member?.voice.channel;

    if (!voiceChannel) {
      return interaction.reply(
        "It was not possible to play the music because you were not in a voice channel."
      );
    }

    return interaction.reply("Osvaldo has successfully joined");
  },
});
