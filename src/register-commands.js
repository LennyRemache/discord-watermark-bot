import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  {
    name: "email",
    description: "Provides customer with email to log in with.",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering commands");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands registered successfully!");
  } catch (err) {
    console.log(`There was an error: ${err}`);
  }
})();
