import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import {
  addWatermark,
  downloadImage,
  loadWatermark,
} from "./imageProcessor.mjs";

export const generateSuccess = async (message) => {
  // Check if there is at least one attachment
  // Just text will not trigger a success watermarked picture to be generated
  if (message.attachments.size > 0) {
    const attachments = message.attachments;
    const text = message.content;
    const user = message.author;
    const username = user.globalName || user.username;
    const avatarURL = user.displayAvatarURL({ format: "png" });

    // Ensure that there exists at least one attachment that is an image
    attachments.filter(
      (attachment) => attachment.contentType.startsWith("image/") === true
    );
    if (attachments.length === 0) {
      return message.reply("Please upload a valid image.");
    }

    try {
      const imageBuffers = await Promise.all(
        attachments.map((attachment) => downloadImage(attachment.url))
      );
      const watermarkBuffer = await loadWatermark();
      const processedImages = await Promise.all(
        imageBuffers.map((imageBuffer) =>
          addWatermark(imageBuffer, watermarkBuffer)
        )
      );
      const processedAttachments = processedImages.map(
        (processedImage, index) =>
          new AttachmentBuilder(processedImage, {
            name: `watermarked-image-${index}.png`,
          })
      );
      await message.delete();

      const embeds = processedAttachments.map((processedAttachment, index) => {
        if (index === 0 && index === processedAttachments.length - 1) {
          return text
            ? new EmbedBuilder()
                .setAuthor({ name: username, iconURL: avatarURL })
                .setDescription(text)
                .setImage(`attachment://watermarked-image-${index}.png`)
                .setTimestamp()
            : new EmbedBuilder()
                .setAuthor({ name: username, iconURL: avatarURL })
                .setImage(`attachment://watermarked-image-${index}.png`)
                .setTimestamp();
        } else if (index === 0) {
          return text
            ? new EmbedBuilder()
                .setAuthor({ name: username, iconURL: avatarURL })
                .setDescription(text)
                .setImage(`attachment://watermarked-image-${index}.png`)
            : new EmbedBuilder()
                .setAuthor({ name: username, iconURL: avatarURL })
                .setImage(`attachment://watermarked-image-${index}.png`)
                .setTimestamp();
        } else if (index !== processedAttachments.length - 1) {
          return new EmbedBuilder().setImage(
            `attachment://watermarked-image-${index}.png`
          );
        } else {
          return new EmbedBuilder()
            .setImage(`attachment://watermarked-image-${index}.png`)
            .setTimestamp();
        }
      });

      await message.channel.send({
        content: `Congratulations on your success <@${user.id}>!`,
        embeds: [...embeds],
        files: [...processedAttachments],
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("There was an error processing your image.");
    }
  }
};
