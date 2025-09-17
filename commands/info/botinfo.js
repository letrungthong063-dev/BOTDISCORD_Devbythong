const { EmbedBuilder } = require("discord.js");
const { formatUptime } = require("../../utils/fileUtils");

module.exports = {
  name: "botinfo",
  description: "Hiển thị thông tin cơ bản của bot",
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Thông tin Bot")
      .setColor(0x3498db)
      .addFields(
        { name: "Tên Bot", value: client.user.username, inline: true },
        { name: "ID Bot", value: client.user.id, inline: true },
        { name: "Số server", value: `${client.guilds.cache.size}`, inline: true },
        { name: "Ping", value: `${client.ws.ping} ms`, inline: true },
        { name: "Uptime", value: formatUptime(client.uptime), inline: false }
      )
      .setFooter({ text: `Yêu cầu bởi ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

    await message.reply({ embeds: [embed] });
  }
};
