const fs = require("fs");
const folderName = process.argv[2] || "Project";

try {
  fs.mkdirSync(folderName);
  fs.writeFileSync(
    `${folderName}/index.html`,
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="style.css" />
        <script src="app.js"></script>
    </head>
    <body></body>
    </html>
`
  );
  fs.writeFileSync(`${folderName}/app.js`, "");
  fs.writeFileSync(`${folderName}/style.css`, "");
} catch (e) {
  console.log("SOMETHING WENT WRONG!!!");
  console.log(e);
}
