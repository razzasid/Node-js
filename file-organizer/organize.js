#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

// File type configurations with nested categories
const fileTypes = {
  code: {
    javascript: ["js", "jsx", "ts", "tsx", "json", "mjs", "cjs"],
    python: ["py", "pyw", "ipynb", "pyc", "pyo", "pyd"],
    web: ["html", "htm", "css", "scss", "sass", "less", "php", "xml", "svg"],
    java: ["java", "class", "jar", "war", "ear"],
    csharp: ["cs", "csx", "cshtml", "csproj", "sln"],
    cpp: ["cpp", "c", "cc", "cxx", "hpp", "h", "hxx"],
    ruby: ["rb", "erb", "gem", "gemspec"],
    go: ["go", "mod", "sum"],
    rust: ["rs", "rlib", "lock"],
    shell: ["sh", "bash", "zsh", "fish"],
    database: ["sql", "db", "sqlite", "sqlite3"],
    config: ["yml", "yaml", "toml", "ini", "conf"],
  },
  design: {
    vector: ["ai", "eps", "svg", "cdr"],
    raster: ["psd", "xcf", "sketch", "fig", "afdesign"],
    prototypes: ["xd", "figma", "sketch", "studio"],
    models: ["blend", "fbx", "obj", "3ds", "c4d"],
    fonts: ["ttf", "otf", "woff", "woff2", "eot"],
  },
  images: {
    raster: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "webp",
      "ico",
      "heic",
      "heif",
    ],
    vector: ["svg", "ai", "eps"],
    raw: ["raw", "cr2", "nef", "arw", "orf", "rw2", "dng"],
    animation: ["gif", "apng", "webp", "flif"],
  },
  documents: {
    text: ["txt", "md", "rtf", "tex", "rst"],
    office: {
      word: ["doc", "docx", "odt", "pages"],
      spreadsheet: ["xls", "xlsx", "ods", "numbers"],
      presentation: ["ppt", "pptx", "odp", "key"],
      database: ["accdb", "mdb"],
    },
    pdf: ["pdf"],
    ebook: ["epub", "mobi", "azw", "azw3", "fb2"],
    technical: ["csv", "xml", "json", "yaml", "yml"],
  },
  media: {
    video: {
      common: ["mp4", "mkv", "mov", "avi", "webm"],
      professional: ["prproj", "aep", "drp", "fcpx"],
      streaming: ["m3u8", "ts", "mts"],
    },
    audio: {
      common: ["mp3", "wav", "ogg", "flac", "m4a", "aac"],
      professional: ["aup", "sesx", "logic", "band"],
      midi: ["mid", "midi"],
    },
  },
  archives: {
    compressed: ["zip", "rar", "7z", "gz", "bz2", "xz", "tar"],
    disk: ["iso", "img", "dmg", "vhd"],
    package: ["deb", "rpm", "pkg", "appimage"],
  },
  development: {
    virtual: ["vbox", "vmdk", "ova"],
    container: ["dockerfile", "docker-compose.yml"],
    git: [".git", ".gitignore", ".gitmodules"],
    ide: [".vscode", ".idea", ".sublime-project"],
  },
  others: [],
};

// Pure functions for file operations
const getCategoryAndSubcategory = (ext) => {
  for (const [category, content] of Object.entries(fileTypes)) {
    // Handle nested structure
    if (typeof content === "object") {
      // Check if it's an array (for backwards compatibility)
      if (Array.isArray(content)) {
        if (content.includes(ext)) {
          return { category, subcategory: null };
        }
      } else {
        // Handle nested categories
        for (const [subcategory, extensions] of Object.entries(content)) {
          // Handle deeply nested structures (like office documents)
          if (Array.isArray(extensions) && extensions.includes(ext)) {
            return { category, subcategory };
          } else if (typeof extensions === "object") {
            // Handle third level nesting
            for (const [subtype, subExtensions] of Object.entries(extensions)) {
              if (subExtensions.includes(ext)) {
                return { category, subcategory: `${subcategory}/${subtype}` };
              }
            }
          }
        }
      }
    }
  }
  return { category: "others", subcategory: null };
};

const getDestinationPath = (folderPath, file, { category, subcategory }) => {
  const basePath = path.join(folderPath, category);
  return subcategory
    ? path.join(basePath, subcategory, file)
    : path.join(basePath, file);
};

const createDirectoryIfNotExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const moveFile = async (oldPath, newPath, isDryRun) => {
  if (isDryRun) {
    console.log(
      `🔄 [Dry Run] Would move ${path.basename(oldPath)} to ${path.relative(
        path.dirname(oldPath),
        newPath
      )}`
    );
    return;
  }

  await createDirectoryIfNotExists(path.dirname(newPath));
  await fs.rename(oldPath, newPath);
  console.log(
    `✅ Moved ${path.basename(oldPath)} to ${path.relative(
      path.dirname(oldPath),
      newPath
    )}`
  );
};

const processFile = async (folderPath, file, isDryRun) => {
  try {
    const filePath = path.join(folderPath, file);
    const stats = await fs.stat(filePath);

    if (!stats.isFile() || file.startsWith(".")) {
      return;
    }

    const ext = path.extname(file).slice(1).toLowerCase();
    const categorization = getCategoryAndSubcategory(ext);
    const newPath = getDestinationPath(folderPath, file, categorization);

    await moveFile(filePath, newPath, isDryRun);
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
};

// Main organization function
const organizeFiles = async (folderPath, isDryRun = false) => {
  try {
    console.log(`📂 Organizing files in: ${folderPath}`);
    if (isDryRun)
      console.log("🧪 Running in dry-run mode (no files will be moved)");

    const files = await fs.readdir(folderPath);
    await Promise.all(
      files.map((file) => processFile(folderPath, file, isDryRun))
    );

    console.log("✨ Organization complete!");
  } catch (error) {
    console.error("❌ Error organizing files:", error.message);
    process.exit(1);
  }
};

// CLI handling
const main = async () => {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const folderPath = args.find((arg) => !arg.startsWith("--")) || process.cwd();

  try {
    await fs.access(folderPath);
    await organizeFiles(folderPath, isDryRun);
  } catch {
    console.error("❌ Please enter a valid path");
    process.exit(1);
  }
};

main();
