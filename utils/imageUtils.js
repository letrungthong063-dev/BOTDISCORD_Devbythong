const fs = require("fs");
const Canvas = require("canvas");
const axios = require("axios");

/**
 * Xoá nền bằng remove.bg
 */
async function removeBg(imgBuffer, apiKeys) {
  const url = "https://api.remove.bg/v1.0/removebg";
  let lastError = null;

  for (const key of apiKeys) {
    try {
      const res = await axios.post(url, imgBuffer, {
        headers: {
          "X-Api-Key": key,
          "Content-Type": "application/octet-stream"
        },
        responseType: "arraybuffer",
        params: { size: "auto" }
      });

      if (res.status === 200) {
        console.log(`[REMOVE.BG] ✅ Thành công với API: ${key}`);
        return res.data;
      }
    } catch (err) {
      lastError = err.response ? err.response.data : err.message;
      console.log(`[REMOVE.BG] ⚠️ API ${key} lỗi: ${lastError}`);
    }
  }

  throw new Error(`❌ Tất cả API key đều lỗi. Lỗi cuối: ${lastError}`);
}

/**
 * Thêm khung vào ảnh
 */
async function addBorderWithTemplate(imgBuffer, framePath, outputPath) {
  const baseImg = await Canvas.loadImage(imgBuffer);
  const frameImg = await Canvas.loadImage(framePath);

  const canvas = Canvas.createCanvas(frameImg.width, frameImg.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImg, 0, 0, frameImg.width, frameImg.height);
  ctx.drawImage(frameImg, 0, 0);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

/**
 * Cắt ảnh thành hình tròn
 */
async function makeCircleImage(imgBuffer, outputPath) {
  const img = await Canvas.loadImage(imgBuffer);
  const size = Math.min(img.width, img.height);

  const canvas = Canvas.createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, 0, 0, size, size);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

module.exports = {
  removeBg,
  addBorderWithTemplate,
  makeCircleImage
};
