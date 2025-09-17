const { AttachmentBuilder } = require("discord.js");
const { removeBg } = require("../../utils/imageUtils");

module.exports = {
  name: "rmbg",
  description: "Xoá nền ảnh (reply hoặc gửi kèm ảnh)",
  async execute(message, args, client, config) {
    let attachments = [];

    // Nếu reply tin nhắn có ảnh
    if (message.reference) {
      const refMsg = await message.channel.messages.fetch(message.reference.messageId);
      attachments = attachments.concat(refMsg.attachments.toJSON());
    }

    // Nếu đính kèm ảnh trong lệnh
    attachments = attachments.concat(message.attachments.toJSON());

    if (attachments.length === 0) {
      return message.reply("❌ Vui lòng reply vào ảnh hoặc đính kèm ảnh.");
    }

    const processing = await message.reply("⏳ Đang xử lý ảnh...");
    const files = [];

    for (let i = 0; i < attachments.length; i++) {
      try {
        const res = await fetch(attachments[i].url);
        const imgBuffer = Buffer.from(await res.arrayBuffer());
        const outBuffer = await removeBg(imgBuffer, config.removebg_keys);

        const file = new AttachmentBuilder(outBuffer, { name: `no_bg_${i + 1}.png` });
        files.push(file);
      } catch (err) {
        await message.channel.send(`❌ Lỗi khi xử lý ${attachments[i].name}: ${err.message}`);
      }
    }

    if (files.length > 0) {
      await processing.edit("✅ Đã xoá nền xong!");
      await message.channel.send({ files });
    } else {
      await processing.edit("❌ Không xử lý được ảnh nào.");
    }
  }
};
