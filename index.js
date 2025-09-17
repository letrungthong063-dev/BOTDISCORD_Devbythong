const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
const prefix = config.prefix;

// ================== Load tất cả command ==================
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("name" in command && "execute" in command) {
      client.commands.set(command.name, command);
    } else {
      console.warn(`⚠️ Command ${file} bị thiếu "name" hoặc "execute"`);
    }
  }
}

// ================== Event khi bot online ==================
client.once("ready", () => {
  console.log(`✅ Bot đã sẵn sàng: ${client.user.tag}`);
});

// ================== Xử lý lệnh ==================
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) {
    return message.reply(`❌ Lệnh không tồn tại. Gõ \`${prefix}helpme\` để xem danh sách lệnh.`);
  }

  try {
    await command.execute(message, args, client, config);
    console.log(`📢 [INFO] ${message.author.tag} dùng lệnh !${commandName} tại #${message.channel.name}`);
  } catch (error) {
    console.error(error);
    message.reply("❌ Có lỗi xảy ra khi chạy lệnh.");
  }
});

// ================== Chạy bot ==================
client.login(process.env.TOKEN);
