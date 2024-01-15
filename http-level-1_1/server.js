const fs = require('fs');
const http = require('http');


function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const server = http.createServer((req, res) => {
    let filePath = '';

    switch (req.url) {
        case '/':
            filePath = 'pages/index.html';
            break;
        case '/about':
            filePath = 'pages/about.html';
            break;
        case '/contact':
            filePath = 'pages/contact.html';
            break;
        case '/faq':
            filePath = 'pages/faq.html';
            break;
        default:
            filePath = '/pages/404.html';
            break;
    }
    readFile(filePath)
        .then(contents => {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(contents)
        })
        .catch(error => {
            res.writeHead(500)
            res.end('Ein fehler ist aufgetreten' + error.message);
        })
})

const PORT = 420;
server.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}/`);
})