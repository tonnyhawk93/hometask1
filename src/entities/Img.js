const {generateId} = require('../utils/generateId');

module.exports = class Img {
  constructor(file) {
    this.id = generateId();
    this.createdAt = Date.now();
    this.fileName = `${this.id}.jpg`;
    this.data = file.buffer;
    this.size = file.size;
  }

  getInfo() {
    return {
      id: this.id,
      size: this.size, 
      createdAt: this.createdAt      
    };
  }
};