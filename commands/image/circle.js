const fs = require("fs");
const { AttachmentBuilder } = require("discord.js");
const { makeCircleImage } = require("../../utils/imageUtils");

module.exports = {
  name: "circle",
  description: "Cắt ảnh thành hình tròn (reply ảnh)",
  async execute(message) {
    if (!message.reference) {
      return message.reply("⚠️ Bạn phải reply vào một tin nhắn có ảnh!");
    }

    const replied = await message.channel.messages.fetch(message.reference.messageId);
    if (replied.attachments.size === 0) {
      return message.reply("⚠️ Tin nhắn bạn reply không có ảnh!");
    }

    const processing = await message.reply("🔄 Đang xử lý...");
    const files = [];

    for (const [i, att] of replied.attachments.entries()) {
      try {
        const res = await fetch(att.url);
        const imgBuffer = Buffer.from(await res.arrayBuffer());
        const outputPath = `circle_${i + 1}.png`;

        await makeCircleImage(imgBuffer, outputPath);
        files.push(new AttachmentBuilder(outputPath));

        fs.unlinkSync(outputPath);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }

    if (files.length > 0) {
      await processing.edit("✨ Ảnh đã được cắt thành hình tròn!");
      await message.channel.send({ files });
    } else {
      await processing.edit("❌ Không xử lý được ảnh nào!");
    }
  }
};
