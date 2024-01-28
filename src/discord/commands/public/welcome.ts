import { Command } from "@/discord/base";
import { settings } from "@/settings";
import {
  brBuilder,
  createEmbedAuthor,
  createRow,
  hexToRgb,
  spaceBuilder,
  replaceText,
} from "@magicyan/discord";
import {
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Locale,
  hyperlink,
} from "discord.js";
import lang from "./welcome.lang.json";

new Command({
  name: "welcome",
  dmPermission: false,
  description: "Welcome command",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const { user, locale } = interaction;

    const avaliableLocales =
      locale == Locale.EnglishUS || locale == Locale.PortugueseBR
        ? locale
        : Locale.EnglishUS;

    const githubProfileUrl = "https://github.com/lucasfernandes20";

    const embed = new EmbedBuilder({
      author: createEmbedAuthor({ user }),
      color: hexToRgb(settings.colors.theme.success),
      description: brBuilder(
        ...lang.description[avaliableLocales].map((text) =>
          replaceText(text, {
            "var(user)": user,
          })
        )
      ),
      footer: {
        text: replaceText(lang.footer[avaliableLocales], {
          "var(github)": spaceBuilder("Kukka dev", githubProfileUrl),
        }),
        iconURL: githubProfileUrl + ".png",
      },
    });

    interaction.reply({
      ephemeral,
      embeds: [embed],
      files: [
        "https://i.pinimg.com/474x/07/46/2e/07462ea00b3efa600d38f35b6c90427a.jpg",
      ],
    });
  },
});
