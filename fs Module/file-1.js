import { readFile, writeFile, appendFile } from "node:fs/promises";

// const contentBuffer = await readFile("/home/raza/Desktop/file-2.txt");

// const contentBuffer = await readFile("aadhar.pdf");

// console.log(contentBuffer);

// writeFile("/home/raza/Desktop/faiz-aadhar.pdf", contentBuffer);

try {
  const contentBuffer = await readFile("nodejss.png");
  writeFile("/home/raza/Desktop/my-img.jpg", contentBuffer);
} catch (err) {
  appendFile(
    "error.log",
    `\n\n${new Date().toLocaleTimeString()}\n${err.message}\n${err.stack}`
  );
  console.log(err);
  console.log("To see full error message go to ./error.log file");
}
