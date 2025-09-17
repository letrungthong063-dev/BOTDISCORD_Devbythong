const fs = require("fs");
const path = require("path");

module.exports = {
  name: "delete",
  description: "Xoá thư mục (có xác nhận)",
  async execute(message, args) {
    if (!args[0]) return message.reply("❌ Vui lòng nhập tên thư mục!");

    const folder = args[0];
    const folderPath = path.join("data", folder);

    if (!fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục không tồn tại!");
    }

    const confirmMsg = await message.reply(
      `⚠️ Bạn có chắc muốn xoá thư mục **${folder}** không?\nNhấn ✅ để xác nhận hoặc ❌ để huỷ.`
    );
    await confirmMsg.react("✅");
    await confirmMsg.react("❌");

    const filter = (reaction, user) =>
      ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;

    try {
      const collected = await confirmMsg.awaitReactions({ filter, max: 1, time: 30000 });
      const choice = collected.first();

      if (choice.emoji.name === "✅") {
        fs.rmSync(folderPath, { recursive: true, force: true });
        await message.reply(`🗑️ Đã xoá thư mục **${folder}**`);
      } else {
        await message.reply("❌ Đã huỷ lệnh xoá.");
      }
    } catch {
      await message.reply("⌛ Hết thời gian xác nhận, lệnh xoá đã bị huỷ.");
    }
  }
};
