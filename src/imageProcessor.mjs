import { promises as fs } from "fs";
import { resolve } from "path";
import sharp from "sharp";
import fetch from "node-fetch";

/**
 * Downloads an image from a URL.
 * @param {string} url - The URL of the image.
 * @returns {Promise<Buffer>} - The buffer of the downloaded image.
 */
export async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const imageBuffer = await response.arrayBuffer();
    return imageBuffer;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw new Error("Error downloading image");
  }
}

/**
 * Loads the watermark image from the local file system.
 * @returns {Promise<Buffer>} - The buffer of the watermark image.
 */
export async function loadWatermark() {
  try {
    const watermarkPath = resolve("watermark.png");
    const watermarkBuffer = await fs.readFile(watermarkPath); // fs.readFile return a Buffer
    return watermarkBuffer;
  } catch (error) {
    console.error("Error loading watermark:", error);
    throw new Error("Error loading watermark");
  }
}

/**
 * Adds a watermark to an image.
 * @param {Buffer} imageBuffer - The buffer of the image to process.
 * @param {Buffer} watermarkBuffer - The buffer of the watermark image.
 * @returns {Promise<Buffer>} - The buffer of the processed image with the watermark.
 */
export async function addWatermark(imageBuffer, watermarkBuffer) {
  try {
    // Get dimensions of the image
    const image = sharp(imageBuffer);
    const { width, height } = await image.metadata();

    const resizedWatermarkBuffer = await sharp(watermarkBuffer)
      .resize({
        width: width < 256 ? width : null,
      })
      .toBuffer();
    const processedImage = await sharp(imageBuffer)
      .composite([
        {
          input: resizedWatermarkBuffer,
          tile: true,
        },
      ])
      .toBuffer();
    return processedImage;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Error processing image");
  }
}
