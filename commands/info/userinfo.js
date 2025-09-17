const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Hiển thị thông tin về một user",
  async execute(message, args) {
    let member = message.mentions.members.first() || message.member;

    const embed = new EmbedBuilder()
      .setTitle(`👤 Thông tin người dùng: ${member.user.tag}`)
      .setColor(0xe67e22)
      .addFields(
        { name: "ID", value: `${member.id}`, inline: true },
        { name: "Tên hiển thị", value: member.displayName, inline: true },
        { name: "Tham gia server", value: member.joinedAt.toLocaleString("vi-VN"), inline: false },
        { name: "Tạo tài khoản", value: member.user.createdAt.toLocaleString("vi-VN"), inline: false }
      );

    if (member.displayAvatarURL()) embed.setThumbnail(member.displayAvatarURL());

    await message.reply({ embeds: [embed] });
  }
};
