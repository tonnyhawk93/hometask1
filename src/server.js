const express = require('express');
const fs = require('fs');
const path = require('path');
const { replaceBackground } = require('backrem');
const app = express();
const multer = require('multer');
const upload = multer();
const { PORT , imgFolder} = require('./config')
const Img = require('./entities/Img');
const db = require('./entities/Db');

app.use(upload.single('image'));

app.get('/list', (req, res) => {
    res.json(db.getList());
})

app.get('/image/:id', (req, res) => {
    const imgId = req.params.id;
    const img = db.findOne(imgId);
    if (img) {        
        res.type(img.type);
        res.sendFile(img.link);
    } else {
        res.status(404);
        res.end('Not found');
    }
})

app.delete('/image/:id', (req, res) => {
    const imgId = req.params.id;
    const img = db.findOne(imgId);
    if (img) {
        db.remove(img);
        res.status(200);
        res.end();
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
    
    let imgFront = db.findOne(req.query.front);
    let imgBack = db.findOne(req.query.back);

    if(imgFront && imgBack) {
        const front = fs.createReadStream(imgFront.link);
        const back = fs.createReadStream(imgBack.link);
        let color, threshold;
        if(req.query.color) color = req.query.color.split(',');
        if(req.query.threshold) threshold = new Number(req.query.threshold);
        

        replaceBackground(front, back, color, threshold)
        .then((readableStream) => {
            res.type(imgFront.type);  
            let link = path.resolve(imgFolder, `./result.${imgFront.type}`)
            const writableStream = fs.createWriteStream(link);
            readableStream.pipe(writableStream);
            readableStream.on('end', () =>{
                res.sendFile(link);
            })
        })
        .catch((e)=>{
            console.log(e)
            res.status(400);
            res.end('Bad request');    
        })
    }else {
        res.status(400);
        res.end('Bad request'); 
    }    
})



app.post('/upload', (req, res) => {
    const { file } = req;
    if(file && (file.mimetype === 'image/jpeg' || file.mimetype === "image/png")) {         
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





