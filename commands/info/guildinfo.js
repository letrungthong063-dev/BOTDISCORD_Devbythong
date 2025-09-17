const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildinfo",
  description: "Hiển thị danh sách các server mà bot đang tham gia",
  async execute(message, args, client) {
    const guilds = client.guilds.cache;
    if (guilds.size === 0) {
      return message.reply("❌ Bot chưa tham gia server nào.");
    }

    let description = "";
    guilds.forEach(g => {
      description += `• **${g.name}** (ID: ${g.id}) | 👥 ${g.memberCount} thành viên\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🌐 Danh sách Server")
      .setDescription(description)
      .setColor(0x1abc9c)
      .setFooter({ text: `Tổng cộng: ${guilds.size} server` });

    await message.reply({ embeds: [embed] });
  }
};
