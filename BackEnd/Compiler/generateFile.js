import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// Convert import.meta.url to a path
const __filename = fileURLToPath(import.meta.url); //file:///Users/adityaverma/Desktop/project X/BackEnd/Compiler/generateFile.js -> /Users/adityaverma/Desktop/project X/BackEnd/Compiler/generateFile.js
const __dirname = path.dirname(__filename); // /Users/adityaverma/Desktop/project X/BackEnd/Compiler
const dirCodes = path.join(__dirname, "codes"); // /Users/adityaverma/Desktop/project X/BackEnd/Compiler/codes

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
  const jobID = uuidv4(); // a4b2c123-99d6-5409-a1b2-123456789abc
  const filename = `${jobID}.${format}`; // a4b2c123-99d6-5409-a1b2-123456789abc.cpp"
  const filePath = path.join(dirCodes, filename); // /Users/adityaverma/Desktop/project X/BackEnd/Compiler/codes/a4b2c123-99d6-5409-a1b2-123456789abc.cpp
  fs.writeFileSync(filePath, content);
  return filePath;
};

export default generateFile;
