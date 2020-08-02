const http = require('http');
const fs = require('fs');
const browserify = require('browserify');
const db = require('level')('./db');
const template = require('lodash').template(fs.readFileSync('index.html', 'utf8'));

let server = http.createServer((req, res) => {
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

server.listen(8080, () => {
    console.log('Server running at http//localhost:8080'); 
})


