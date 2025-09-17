const { EmbedBuilder } = require("discord.js");
const { formatUptime } = require("../../utils/fileUtils");

module.exports = {
  name: "status",
  description: "Xem trạng thái bot",
  async execute(message, args, client, config) {
    const uptime = formatUptime(client.uptime);
    const latency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setTitle("📊 Trạng thái Bot")
      .setColor(0x00ff99)
      .addFields(
        { name: "👑 Admin", value: config.admin, inline: false },
        { name: "🌐 Số server", value: `${client.guilds.cache.size}`, inline: true },
        { name: "⏱️ Uptime", value: uptime, inline: true },
        { name: "💡 Tình trạng", value: "Online ✅", inline: true },
        { name: "⚡ Tốc độ", value: `${latency} ms`, inline: true }
      );

    await message.reply({ embeds: [embed] });
  }
};
