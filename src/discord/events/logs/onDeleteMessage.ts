import { Event } from "@/discord/base";

export default new Event({
  name: "messageDelete",
  once: false,
  async run(message) {},
});
