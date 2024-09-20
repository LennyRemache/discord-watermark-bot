import { Client, GatewayIntentBits } from "discord.js";

import dotenv from "dotenv";
import { generateSuccess } from "./success.js";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.channel.id === process.env.SUCCESS_CHANNEL_ID) {
    generateSuccess(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
