const fs = require("fs");
const path = require("path");

module.exports = {
  name: "create",
  description: "Tạo thư mục chứa ảnh",
  async execute(message, args) {
    if (!args[0]) return message.reply("❌ Vui lòng nhập tên thư mục!");

    const folder = args[0];
    const folderPath = path.join("data", folder);

    if (fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục đã tồn tại!");
    }

    fs.mkdirSync(folderPath, { recursive: true });
    await message.reply(`📂 Đã tạo thư mục **${folder}**`);
  }
};
