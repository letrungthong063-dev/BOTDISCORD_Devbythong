const fs = require("fs");
const { AttachmentBuilder } = require("discord.js");
const { addBorderWithTemplate } = require("../../utils/imageUtils");

module.exports = {
  name: "border",
  description: "Thêm khung cho ảnh (reply ảnh, !border id:<file>)",
  async execute(message, args) {
    if (!args[0] || !args[0].startsWith("id:")) {
      return message.reply("❌ Sai cú pháp! Dùng: `!border id:<tên_file>` (VD: !border id:1)");
    }

    const frameId = args[0].split("id:")[1];
    const templatePath = `${frameId}.png`;

    if (!fs.existsSync(templatePath)) {
      return message.reply(`⚠️ Không tìm thấy file khung **${templatePath}**!`);
    }

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
        const outputPath = `output_${i + 1}.png`;

        await addBorderWithTemplate(imgBuffer, templatePath, outputPath);
        files.push(new AttachmentBuilder(outputPath));

        fs.unlinkSync(outputPath);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }

    if (files.length > 0) {
      await processing.edit(`✨ Đã thêm khung từ **${templatePath}**!`);
      await message.channel.send({ files });
    } else {
      await processing.edit("❌ Không xử lý được ảnh nào!");
    }
  }
};
