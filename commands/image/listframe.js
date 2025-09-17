const fs = require("fs");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "listframe",
  description: "Xem danh sách các file khung PNG có sẵn trong thư mục frames/",
  async execute(message) {
    const framesDir = path.join(__dirname, "../../frames");

    // Nếu chưa có thư mục frames thì tạo
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
      return message.reply("❌ Thư mục `frames/` chưa có khung nào.");
    }

    // Lọc file PNG
    const frames = fs.readdirSync(framesDir).filter(f => f.toLowerCase().endsWith(".png"));
    if (frames.length === 0) {
      return message.reply("❌ Không tìm thấy khung nào trong thư mục `frames/`.");
    }

    // Gửi danh sách từng nhóm 10 file (giới hạn Discord)
    const maxFilesPerMsg = 10;
    for (let i = 0; i < frames.length; i += maxFilesPerMsg) {
      const batch = frames.slice(i, i + maxFilesPerMsg);
      const filesToSend = batch.map(f => new AttachmentBuilder(path.join(framesDir, f)));
      const caption =
        "📂 **Danh sách khung khả dụng:**\n" +
        batch.map(f => `• ${f.replace(".png", "")}`).join("\n");

      await message.reply({ content: caption, files: filesToSend });
    }
  }
};
