const fs = require("fs");
const path = require("path");
const { zipFolder } = require("../../utils/fileUtils");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "zip",
  description: "Nén thư mục thành file zip",
  async execute(message, args) {
    if (!args[0]) return message.reply("❌ Vui lòng nhập tên thư mục!");

    const folderName = args[0];
    const folderPath = path.join("data", folderName);

    if (!fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục không tồn tại!");
    }

    const status = await message.reply("🔄 Đang xử lý...");
    const zipPath = path.join("data", `${folderName}.zip`);

    try {
      await zipFolder(folderPath, zipPath);
      const size = fs.statSync(zipPath).size;

      if (size <= 25 * 1024 * 1024) {
        await status.edit(`✅ Nén thư mục **${folderName}** thành công!`);
        await message.channel.send({ files: [new AttachmentBuilder(zipPath)] });
      } else {
        await status.edit(`⚠️ File zip quá nặng (${(size / 1024 / 1024).toFixed(2)} MB), không thể gửi qua Discord.`);
      }
      fs.unlinkSync(zipPath);
    } catch (err) {
      console.error(err);
      await status.edit("❌ Có lỗi khi nén thư mục.");
    }
  }
};
