const { AttachmentBuilder } = require("discord.js");
const { addBorderWithTemplate } = require("../../utils/imageUtils");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

module.exports = {
  name: "border",
  description: "Thêm khung cho ảnh (reply ảnh và nhập !border id:<tên_khung>)",
  async execute(message, args) {
    // kiểm tra có reply tin nhắn chứa ảnh không
    if (!message.reference) {
      return message.reply("⚠️ Bạn phải reply vào một tin nhắn có ảnh!");
    }

    const replied = await message.channel.messages.fetch(message.reference.messageId);
    if (replied.attachments.size === 0) {
      return message.reply("⚠️ Tin nhắn bạn reply không có ảnh!");
    }

    // lấy tên khung
    const arg = args.join(" ");
    if (!arg.startsWith("id:")) {
      return message.reply("❌ Sai cú pháp! Dùng: `!border id:<tên_khung>` (VD: !border id:gold)");
    }

    const frameName = arg.replace("id:", "").trim();
    const framePath = path.join(__dirname, "../../frames", `${frameName}.png`);

    if (!fs.existsSync(framePath)) {
      return message.reply(`❌ Không tìm thấy khung **${frameName}.png** trong thư mục \`frames/\``);
    }

    const processing = await message.reply("🔄 Đang xử lý...");

    const files = [];

    for (const [i, att] of replied.attachments.entries()) {
      try {
        const res = await fetch(att.url);
        const imgBuffer = Buffer.from(await res.arrayBuffer());

        const outputPath = path.join(__dirname, "../../temp", `border_${Date.now()}_${i + 1}.png`);
        await addBorderWithTemplate(imgBuffer, framePath, outputPath);

        files.push(new AttachmentBuilder(outputPath));
        fs.unlinkSync(outputPath); // xoá file tạm sau khi thêm vào danh sách gửi
      } catch (err) {
        console.error("❌ Error:", err);
        await message.channel.send(`❌ Lỗi khi xử lý ảnh: ${err.message}`);
      }
    }

    if (files.length > 0) {
      await processing.edit(`✨ Đã thêm khung từ **${frameName}.png**!`);
      await message.channel.send({ files });
    } else {
      await processing.edit("❌ Không xử lý được ảnh nào!");
    }
  }
};
