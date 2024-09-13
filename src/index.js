import { Client, GuildMember, IntentsBitField, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

// signal when bot is live
client.on("ready", (c) => {
  console.log(`${c.user.tag} is online!`);
});

// custom prefix commands
client.on("messageCreate", (message) => {
  console.log(message.content);
  if (message.content.startsWith("?")) {
    const command = message.content.slice(1);

    if (command === "email") {
      console.log(message.member.permissions.has("Administrator"));
      message.channel.send("EMAIL");
    }
  }
});

// slash commands
client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "email") {
    console.log(interaction);
    interaction.user.send("Hey");
  }
});

client.login(process.env.DISCORD_TOKEN);
