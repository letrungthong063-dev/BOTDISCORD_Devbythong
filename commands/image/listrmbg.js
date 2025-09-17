const axios = require("axios");

module.exports = {
  name: "listrmbg",
  description: "Xem số lượt remove.bg còn lại cho tất cả API key",
  async execute(message, args, client, config) {
    let results = [];
    let totalAll = 0;

    for (let i = 0; i < config.removebg_keys.length; i++) {
      const apiKey = config.removebg_keys[i];
      try {
        const res = await axios.get("https://api.remove.bg/v1.0/account", {
          headers: { "X-Api-Key": apiKey }
        });

        const api = res.data.data.attributes.api;
        const freeCalls = api.free_calls || 0;
        const payg = api.payg_credits || 0;
        const sub = (api.subscription && api.subscription.credits) || 0;

        const total = freeCalls + payg + sub;
        totalAll += total;
        results.push(`🔑 API ${i + 1}: **${total} lượt** còn lại`);
      } catch (err) {
        results.push(`🔑 API ${i + 1}: ❌ Lỗi khi kiểm tra (${err.message})`);
      }
    }

    let msg = "📊 **Trạng thái API remove.bg**\n\n" + results.join("\n");
    msg += `\n\n📌 **TỔNG CỘNG: ${totalAll} lượt còn lại**`;
    await message.reply(msg);
  }
};
