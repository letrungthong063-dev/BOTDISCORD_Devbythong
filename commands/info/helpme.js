module.exports = {
  name: "helpme",
  description: "Xem hướng dẫn sử dụng bot",
  async execute(message, args, client, config) {
    const helpText = `
📖 **Hướng dẫn sử dụng Bot**

━━━━━━━━━━━━━━━━━━━━━━
🗂️ **QUẢN LÝ THƯ MỤC**
\`!create <tên_thư_mục>\` → Tạo thư mục chứa ảnh  
\`!list\` → Liệt kê thư mục hiện có  
\`!delete <thư_mục>\` → Xoá thư mục (có xác nhận)  
\`!deleteimg <tên_thư_mục>: <tên_ảnh>\` → Xoá ảnh trong thư mục  
\`!zip <thư_mục>\` → Nén thư mục thành file .zip  

━━━━━━━━━━━━━━━━━━━━━━
🖼️ **QUẢN LÝ ẢNH**
\`!add <thư_mục>: tên1,tên2,...\` (reply tin nhắn có ảnh) → Thêm ảnh PNG  
\`!show <thư_mục>\` → Hiển thị ảnh trong thư mục  
\`!rename <thư_mục>: <tên_cũ>=<tên_mới>\` → Đổi tên ảnh  

━━━━━━━━━━━━━━━━━━━━━━
🎨 **KHUNG ẢNH**
\`!border id:<tên_file>\` (reply ảnh) → Thêm khung cho ảnh  
\`!listframe\` → Xem danh sách các file khung có sẵn  
\`!circle\` → Cắt ảnh thành hình tròn  

━━━━━━━━━━━━━━━━━━━━━━
⚙️ **HỆ THỐNG**
\`!helpme\` → Xem hướng dẫn này  
\`!status\` → Xem trạng thái bot  

━━━━━━━━━━━━━━━━━━━━━━
👑 **Admin**: ${config.admin}
`;
    await message.reply(helpText);
  }
};
