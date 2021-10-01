const { EventEmitter } = require('events');
const { dbDumpFile} = require('../config')
const { writeFile, removeFile } = require('../utils/fs');
const { existsSync } = require('fs');
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
    await writeFile(img.link, img.body);
    this.data[img.id] = img.getInfo();
    this.emit('changed');    
  }

  getList() {
    return Object.values(this.data);
  }

  getData() {
    return this.data;
  }
  async remove(img) {   
    await removeFile(img.link);
    delete this.data[img.id];
    this.emit('changed');
    return;
  }

  findOne(imgId) {
    if(this.data[imgId]) {      
      return this.data[imgId]
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
