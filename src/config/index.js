const path = require('path');
const fs = require('fs');
const dbFolder = path.resolve(__dirname, '../db/')
const imgFolder = path.resolve(dbFolder, './images/');
const dbDumpFile = path.resolve(dbFolder, './dump.json');

try {
  fs.mkdirSync(dbFolder);
  fs.mkdirSync(imgFolder);
}catch {
  
}

module.exports = {
    PORT: 8080,
    dbFolder,  
    imgFolder,
    dbDumpFile
  };