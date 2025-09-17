const fs = require("fs");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "show",
  description: "Hiển thị ảnh trong thư mục",
  async execute(message, args) {
    if (!args[0]) return message.reply("❌ Vui lòng nhập tên thư mục!");

    const folder = args[0];
    const folderPath = path.join("data", folder);

    if (!fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục không tồn tại!");
    }

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".png"));
    if (files.length === 0) {
      return message.reply("📂 Thư mục này chưa có ảnh nào.");
    }

    const chunkSize = 10;
    for (let i = 0; i < files.length; i += chunkSize) {
      const batch = files.slice(i, i + chunkSize);
      const paths = batch.map(f => path.join(folderPath, f));
      const discordFiles = paths.map(fp => new AttachmentBuilder(fp));
      const caption = "📸 Danh sách ảnh:\n" + batch.map(f => `• ${f}`).join("\n");

      await message.reply({ content: caption, files: discordFiles });
    }
  }
};
