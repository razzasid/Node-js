#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");

// Find the folder path (first argument that's not a flag)
const folderPath = args.find((arg) => !arg.startsWith("--")) || process.cwd();

console.log(`📂 Organizing files in: ${folderPath}`);
if (isDryRun)
  console.log("🧪 Running in dry-run mode (no files will be moved)");

const types = {
  images: ["jpg", "jpeg", "png", "gif", "svg"],
  documents: ["pdf", "doc", "docx", "txt", "xlsx"],
  videos: ["mp4", "mkv", "mov"],
  music: ["mp3", "wav"],
  archives: ["zip", "rar", "7z", "tar"],
};

function getCategory(ext) {
  for (let type in types) {
    if (types[type].includes(ext)) return type;
  }
  return "others";
}

if (!fs.existsSync(folderPath)) {
  console.log("❌ Please enter a valid Path.");
  process.exit(1);
}

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    if (file.startsWith(".")) return;

    const itemPath = path.join(folderPath, file);

    if (!fs.statSync(itemPath).isFile()) return;

    const ext = path.extname(file).slice(1).toLowerCase();
    const category = getCategory(ext);

    const categoryPath = path.join(folderPath, category);
    const oldPath = path.join(folderPath, file);
    const newPath = path.join(categoryPath, file);

    if (isDryRun) {
      console.log(`[Dry Run] Would move ${file} to ${category}/`);
    } else {
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath);
      }

      fs.rename(oldPath, newPath, (err) => {
        if (err) console.error(`Error moving ${file}:`, err);
        else console.log(`Moved ${file} to ${category}/`);
      });
    }
  });
});
