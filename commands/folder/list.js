const fs = require("fs");
const path = require("path");
const { getFolderSize } = require("../../utils/fileUtils");

module.exports = {
  name: "list",
  description: "Liệt kê thư mục hiện có",
  async execute(message) {
    const baseDir = "data";
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

    const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());
    if (folders.length === 0) {
      return message.reply("📂 Không có thư mục nào.");
    }

    let msg = "📂 Danh sách thư mục:\n\n";
    for (const folder of folders) {
      const folderPath = path.join(baseDir, folder);
      const count = fs.readdirSync(folderPath).length;
      const size = getFolderSize(folderPath) / 1024;
      msg += `📂 ${folder} | 📸 ${count} ảnh | 📦 ${size.toFixed(2)} KB\n`;
    }

    await message.reply(msg);
  }
};
