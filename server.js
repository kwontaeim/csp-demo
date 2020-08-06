const http = require('http');
const fs = require('fs');
const browserify = require('browserify');
const db = require('level')('./db');
const template = require('lodash').template(fs.readFileSync('index.html'));
const express = require('express');
var app = express(); 

let server = http.createServer((req, res) => {
    res.setHeader('Content-Security-Policy-Report-Only', "default-src 'none'; img-src 'self'; style-src 'self'; script-src 'self'; report-uri 'https://taeim.report-uri.com/r/d/csp/wizard';")
    switch(req.url) {
        case '/index.js':
            browserify('index.js').bundle().pipe(res);
            break;
        case '/index.css':
            fs.createReadStream('index.css').pipe(res);
            break;
        case '/addComment':
            let comment = [];
            req.on('data', data => {
                comment.push(data);
            })
            req.on('end', () => {
                comment = comment.join('')
                db.put(Date.now(), comment, () => {
                    res.end();
                })
            })
            break;
        default : 
            let comments = [];
            db.createReadStream().on('data', data => {
                comments.push(data.value)
            }).on('end', () => {
                res.end(template({comments:comments}))
            })
            break;
    }
})

app.use(express.static('image/public'));
server.listen(8080, () => {
    console.log('Server running at http//localhost:8080'); 
})


