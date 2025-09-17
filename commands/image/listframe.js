const fs = require("fs");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "listframe",
  description: "Xem danh sách các file khung PNG có sẵn",
  async execute(message) {
    const frames = fs.readdirSync(".").filter(f => f.toLowerCase().endsWith(".png"));
    if (frames.length === 0) {
      return message.reply("❌ Không tìm thấy khung nào trong thư mục bot.");
    }

    const maxFiles = 10;
    for (let i = 0; i < frames.length; i += maxFiles) {
      const batch = frames.slice(i, i + maxFiles);
      const files = batch.map(f => new AttachmentBuilder(f));
      const caption = "📂 **Danh sách khung khả dụng:**\n" + batch.map(f => `• ${f}`).join("\n");
      await message.reply({ content: caption, files });
    }
  }
};
