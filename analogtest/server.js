const fs = require('fs');
const http = require('http');

function getContentType(filePath) {

    if (filePath.endsWith('.html')) return 'text/html';
    if (filePath.endsWith('.css')) return 'text/css';
    if (filePath.endsWith('.js')) return 'application/javascript';
    if (filePath.endsWith('.png')) return 'image/png';
    if (filePath.endsWith('.jpg')) return 'image/jpeg';
    if (filePath.endsWith('.jpeg')) return 'image/jpeg';
    if (filePath.endsWith('.json')) return 'application/json';

    return 'application/octet-stream';
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/public/') || req.url === '/services') {
        // Dateipfad wird direkt aus der URL generiert
        let filePath = `.${req.url}`;
        if (req.url === '/services')
            readFile(filePath)
                .then(content => {
                    res.writeHead(200, { 'Content-Type': getContentType(filePath) }).end(content);
                })
                .catch(err => {
                    res.writeHead(404).end('Nicht gefunden');

                });
    } else {
        let filePath = '';
        let statusCode = 200;

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
                filePath = 'pages/404.html';
                statusCode = 404;
                break;
        }

        readFile(filePath)
            .then(content => {
                res.writeHead(statusCode, { 'Content-Type': 'text/html' });
                res.end(content);
            })
            .catch(err => {
                res.writeHead(500);
                res.end('Serverfehler: ' + err.message);
            });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server löuft auf: http://localhost:${PORT}/`);
});