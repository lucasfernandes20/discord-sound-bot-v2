import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "@/discord/base";
import { brBuilder } from "@magicyan/discord";

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
    const { channel, options } = interaction;

    if (channel?.isTextBased()) {
      interaction.editReply(
        "Is not possible to use /play command in this channel."
      );
    }

    const musicPlayer = options.getString("youtube", true);

    interaction.reply({
      content: brBuilder("Playin music on youtube channel", musicPlayer),
    });
  },
});
