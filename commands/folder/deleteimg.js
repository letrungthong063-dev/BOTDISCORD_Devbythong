const fs = require("fs");
const path = require("path");

module.exports = {
  name: "deleteimg",
  description: "Xoá 1 ảnh trong thư mục (!deleteimg <folder>: <tên_ảnh>)",
  async execute(message, args) {
    const argStr = args.join(" ");
    const [folder, imgName] = argStr.split(":");
    if (!folder || !imgName) {
      return message.reply("❌ Sai cú pháp! Dùng: `!deleteimg <thư_mục>: <tên_ảnh>`");
    }

    const folderPath = path.join("data", folder.trim());
    if (!fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục không tồn tại!");
    }

    let targetFile = null;
    const files = fs.readdirSync(folderPath);
    for (const f of files) {
      const name = path.parse(f).name;
      if (name === imgName.trim()) {
        targetFile = path.join(folderPath, f);
        break;
      }
    }

    if (!targetFile) {
      return message.reply(`❌ Ảnh **${imgName.trim()}** không tồn tại trong thư mục **${folder}**`);
    }

    const confirmMsg = await message.reply(
      `⚠️ Bạn có chắc muốn xoá ảnh **${imgName.trim()}** trong thư mục **${folder}** không?\nNhấn ✅ để xác nhận hoặc ❌ để huỷ.`
    );
    await confirmMsg.react("✅");
    await confirmMsg.react("❌");

    const filter = (reaction, user) =>
      ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;

    try {
      const collected = await confirmMsg.awaitReactions({ filter, max: 1, time: 30000 });
      const choice = collected.first();

      if (choice.emoji.name === "✅") {
        fs.unlinkSync(targetFile);
        await message.reply(`🗑️ Đã xoá ảnh **${imgName.trim()}** trong thư mục **${folder}**`);
      } else {
        await message.reply("❌ Đã huỷ lệnh xoá.");
      }
    } catch {
      await message.reply("⌛ Hết thời gian xác nhận, lệnh xoá đã bị huỷ.");
    }
  }
};
