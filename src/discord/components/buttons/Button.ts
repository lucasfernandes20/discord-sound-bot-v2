import { Component } from "@/discord/base";
import { ComponentType } from "discord.js";

export default new Component({
  customId: "my-button",
  type: ComponentType.Button,
  cache: "cached",
  async run(interaction) {
    const { guild, member, channel } = interaction;
  },
});
