const express = require('express');
const fs = require('fs');
const { replaceBackground } = require('backrem');
const app = express();
const multer = require('multer');
const upload = multer();
const { PORT } = require('./config')
const Img = require('./entities/Img');
const db = require('./entities/Db');

app.use(upload.single('image'));

app.get('/', (req, res) => {
    res.send(`<form method="post" enctype="multipart/form-data" action="/upload">
                <input type="file" name="image">
                <input type="submit" value="Submit">
                </form>`);
})

app.get('/list', (req, res) => {
    res.json(db.getList());
})

app.get('/image/:id', (req, res) => {
    const imgId = req.params.id;
    const link = db.findOne(imgId);
    if (link) {
        res.type('jpg');
        res.sendFile(link);
    } else {
        res.status(404);
        res.end();
    }
})

app.delete('/image/:id', (req, res) => {
    const imgId = req.params.id;
    const link = db.findOne(imgId);
    if (link) {
        db.remove(imgId)
        res.status(204);
        res.send('Resource deleted successfully');
    } else {
        res.status(400);
        res.end('Bad request');
    }
})


app.get('/merge', (req, res) => {

    if(!(req.query.front) || !(req.query.back)) {
        res.status(400);
        res.end('Bad request');
    }    
    
    let linkFront = db.findOne(req.query.front);
    let linkBack = db.findOne(req.query.back);

    if(linkFront && linkBack) {
        const front = fs.createReadStream(linkFront);
        const back = fs.createReadStream(linkBack);
        let color, threshold;
        if(req.query.color) color = req.query.color.split(',');
        if(req.query.threshold) threshold = new Number(req.query.threshold);
        

        replaceBackground(front, back, color, threshold)
        .then((readableStream) => {
            res.type('jpg');
            readableStream.pipe(res);    
        });
    }else {
        res.status(400);
        res.end('Bad request'); 
    }    
})



app.post('/upload', (req, res) => {
    const { file } = req;
    if(file && file.mimetype === 'image/jpeg') {         
        const img = new Img(file);
        db.insert(img);
        res.json(img.getInfo());
    }else {
        res.status(400);
        res.end('Bad request');
    }    
})

app.use((error, res) => {
    res.status(404);
    res.end('Not found');
})

app.listen(PORT);





