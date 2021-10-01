const {generateId} = require('../utils/generateId');

module.exports = class Img {
  constructor(file) {
    this.id = generateId();
    this.uploadedAt = Date.now();    
    this.body = file.buffer;
    this.size = file.size;
    this.mimeType = file.mimetype;
    this.fileName = `${this.id}.jpg`;
  }

  getInfo() {
    return {
      id: this.id,
      uploadedAt: this.uploadedAt,
      size: this.size, 
      body: this.body, 
      mimeType: this.mimeType   
    };
  }
};


  
  

  