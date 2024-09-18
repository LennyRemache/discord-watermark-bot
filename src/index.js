import {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
  EmbedBuilder,
} from "discord.js";
import {
  addWatermark,
  downloadImage,
  loadWatermark,
} from "./imageProcessor.mjs";
import dotenv from "dotenv";
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

  // Check if there's an attachment
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    const text = message.content;
    const user = message.author;
    const username = user.globalName || user.username;
    const avatarURL = user.displayAvatarURL({ format: "png" });

    // Ensure the attachment is an image
    if (!attachment.contentType.startsWith("image/")) {
      return message.reply("Please upload a valid image.");
    }

    try {
      const imageBuffer = await downloadImage(attachment.url);
      const watermarkBuffer = await loadWatermark();
      const processedImage = await addWatermark(imageBuffer, watermarkBuffer);
      await message.delete();

      const processedAttachment = new AttachmentBuilder(processedImage, {
        name: "watermarked-image.png",
      });

      const embed = new EmbedBuilder()
        .setAuthor({ name: username, iconURL: avatarURL })
        .setDescription(text)
        .setImage("attachment://watermarked-image.png");

      await message.channel.send({
        content: `Congratulationso on your success <@${user.id}>!`,
        embeds: [embed],
        files: [processedAttachment],
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("There was an error processing your image.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
