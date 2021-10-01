const { EventEmitter } = require('events');
const {imgFolder, dbDumpFile} = require('../config')
const { writeFile, removeFile } = require('../utils/fs');
const { existsSync } = require('fs');
const path = require('path');
const { prettifyJsonToString } = require('../utils/prettifyJsonToString');

class Database extends EventEmitter {
  constructor() {
    super();
    this.data = {};
  }

  async initFromDump() {
    if (existsSync(dbDumpFile) === false) {
      return;
    }

    const dump = require(dbDumpFile);

    if (typeof dump === 'object') {
      this.data = {};

      for (let id in dump) {
        this.data[id] = dump[id]
      }
    }
  }

  async insert(img) {
    await writeFile(path.resolve(imgFolder, img.fileName), img.body);
    this.data[img.id] = img.getInfo();
    this.emit('changed');    
  }

  getList() {
    return Object.values(this.data);
  }

  getData() {
    return this.data;
  }
  async remove(imgId) {

    const fileName = imgId + '.jpg'

    await removeFile(path.resolve(imgFolder, fileName));

    delete this.data[imgId];

    this.emit('changed');

    return imgId;
  }

  findOne(imgId) {
    if(this.getList().some(el => el.id === imgId)) {
      const fileName = imgId + '.jpg';      
      return path.resolve(imgFolder, fileName)
    }else {
      return null
    }
  }
}

const db = new Database();

db.initFromDump();

db.on('changed', () => {  
  writeFile(dbDumpFile, prettifyJsonToString(db.getData()));
});

module.exports = db;
