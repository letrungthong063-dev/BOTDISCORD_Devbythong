const fs = require("fs");
const path = require("path");

module.exports = {
  name: "rename",
  description: "Đổi tên ảnh trong thư mục (!rename <folder>: cũ=mới)",
  async execute(message, args) {
    const argStr = args.join(" ");
    const [folder, names] = argStr.split(":");
    if (!folder || !names) {
      return message.reply("❌ Sai cú pháp! Dùng: `!rename <thư_mục>: <tên_cũ>=<tên_mới>`");
    }

    const [oldName, newName] = names.split("=").map(n => n.trim());
    if (!oldName || !newName) {
      return message.reply("❌ Sai cú pháp! Dùng: `!rename <thư_mục>: <tên_cũ>=<tên_mới>`");
    }

    const folderPath = path.join("data", folder.trim());
    if (!fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục không tồn tại!");
    }

    const files = fs.readdirSync(folderPath);
    let oldFile = null;
    let newFile = null;

    for (const f of files) {
      const name = path.parse(f).name;
      const ext = path.parse(f).ext;
      if (name === oldName) {
        oldFile = path.join(folderPath, f);
        newFile = path.join(folderPath, `${newName}${ext}`);
        break;
      }
    }

    if (!oldFile) {
      return message.reply(`❌ Ảnh **${oldName}** không tồn tại trong thư mục **${folder}**`);
    }
    if (fs.existsSync(newFile)) {
      return message.reply(`⚠️ Ảnh **${newName}** đã tồn tại trong thư mục **${folder}**`);
    }

    fs.renameSync(oldFile, newFile);
    await message.reply(`✅ Đã đổi tên ảnh thành **${path.basename(newFile)}** trong thư mục **${folder}**`);
  }
};
