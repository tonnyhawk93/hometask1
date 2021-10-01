const {generateId} = require('../utils/generateId');
const path = require('path');
const {imgFolder} = require('../config')

module.exports = class Img {
  constructor(file) {
    this.id = generateId();
    this.uploadedAt = Date.now();    
    this.body = file.buffer;
    this.size = file.size;
    this.mimeType = file.mimetype;    
    if(this.mimeType === 'image/jpeg') {
      this.type = 'jpg';      
    }else if(this.mimeType === 'image/png') {
      this.type = 'png';
    }    
    this.fileName = `${this.id}.${this.type}`;
    this.link = path.resolve(imgFolder, this.fileName);
  }

  getInfo() {
    return {
      id: this.id,
      uploadedAt: this.uploadedAt,
      size: this.size, 
      mimeType: this.mimeType,
      type: this.type,
      link: this.link   
    };
  }
};


  
  

  