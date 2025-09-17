const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

/**
 * Tính dung lượng thư mục (byte)
 */
function getFolderSize(folderPath) {
  let total = 0;
  function getSize(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        getSize(filePath);
      } else {
        total += stat.size;
      }
    }
  }
  getSize(folderPath);
  return total;
}

/**
 * Định dạng uptime (d h m s)
 */
function formatUptime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

/**
 * Nén thư mục thành .zip
 */
function zipFolder(folderPath, outputZipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(outputZipPath));
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
}

module.exports = {
  getFolderSize,
  formatUptime,
  zipFolder
};
