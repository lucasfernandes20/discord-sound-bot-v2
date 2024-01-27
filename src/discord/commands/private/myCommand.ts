import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

export default new Command({
  name: "mycommand",
  description: "mycommand",
  type: ApplicationCommandType.ChatInput,
  dmPermission: false,
  run(interaction, store) {
    const { guild } = interaction;
  },
});
