const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Hiển thị thông tin server hiện tại",
  async execute(message) {
    if (!message.guild) {
      return message.reply("❌ Lệnh này chỉ dùng trong server!");
    }

    const guild = message.guild;
    const embed = new EmbedBuilder()
      .setTitle(`🌐 Thông tin Server: ${guild.name}`)
      .setColor(0x2ecc71)
      .addFields(
        { name: "ID", value: `${guild.id}`, inline: true },
        { name: "Số thành viên", value: `${guild.memberCount}`, inline: true },
        { name: "Số kênh", value: `${guild.channels.cache.size}`, inline: true },
        { name: "Chủ sở hữu", value: `<@${guild.ownerId}>`, inline: false }
      );

    if (guild.iconURL()) embed.setThumbnail(guild.iconURL());

    await message.reply({ embeds: [embed] });
  }
};
