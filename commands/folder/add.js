const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");

module.exports = {
  name: "add",
  description: "Thêm ảnh vào thư mục (!add <folder>: tên1,tên2,... reply ảnh)",
  async execute(message, args) {
    if (!message.reference) {
      return message.reply("❌ Hãy reply vào tin nhắn chứa ảnh để thêm.");
    }

    const argStr = args.join(" ");
    const [folder, namesStr] = argStr.split(":");
    if (!folder || !namesStr) {
      return message.reply("❌ Sai cú pháp! Dùng: `!add <thư_mục>: tên1,tên2,...`");
    }

    const folderName = folder.trim();
    const names = namesStr.split(",").map(n => n.trim());

    const folderPath = path.join("data", folderName);
    if (!fs.existsSync(folderPath)) {
      return message.reply("❌ Thư mục không tồn tại!");
    }

    const refMsg = await message.channel.messages.fetch(message.reference.messageId);
    const attachments = refMsg.attachments.toJSON();

    if (attachments.length !== names.length) {
      return message.reply("❌ Số lượng ảnh và số lượng tên không khớp!");
    }

    const status = await message.reply("🔄 Đang xử lý...");

    for (let i = 0; i < attachments.length; i++) {
      const att = attachments[i];
      const filename = `${names[i]}.png`;
      const filepath = path.join(folderPath, filename);

      const res = await fetch(att.url);
      const buffer = Buffer.from(await res.arrayBuffer());

      const img = await Canvas.loadImage(buffer);
      const canvas = Canvas.createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const outBuffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filepath, outBuffer);
    }

    await status.edit(`✅ Đã thêm ${names.length} ảnh vào thư mục **${folderName}**`);
  }
};
