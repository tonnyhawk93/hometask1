const express = require('express');
const fs = require('fs');
const { replaceBackground } = require('backrem');
const path = require("path");
const app = express();
const multer = require('multer');
const upload = multer();
const {PORT} = require('./config')
const Img = require('./entities/Img');
const db = require('./entities/Db');

app.use(upload.single('file'));

app.get('/', (req, res) => {
    res.send(`<form method="post" enctype="multipart/form-data" action="/upload">
                <input type="file" name="file">
                <input type="submit" value="Submit">
                </form>`);
})

app.get('/list', (req, res) => {
    res.json(db.getList());
})

app.get('/image/:id', (req, res) => {
    const imgId = req.params.id;
    const link = db.findOne(imgId);
    if(link) {
        res.download(link);
    }else{        
        res.status(404);
        res.end(); 
    }   
})

app.delete('/image/:id', (req, res) => {
    const imgId = req.params.id;
    const link = db.findOne(imgId);
    if(link) {
        db.remove(imgId)
        res.send(imgId);
    }else{        
        res.status(404);
        res.end(); 
    }   
})


app.get('/merge', (req, res) => {

    const front = fs.createReadStream(db.findOne(req.query.front));
    const back = fs.createReadStream(db.findOne(req.query.back));
    const color = req.query.color.split(',');
    const threshold = new Number(req.query.threshold);

    replaceBackground(front, back, color, threshold)
    .then(readableStream => readableStream.pipe(res));
})



app.post('/upload', (req, res) => {
    const { file } = req;
    const img = new Img(file);
    db.insert(img);
    res.send(img.id);
})

app.listen(PORT);





