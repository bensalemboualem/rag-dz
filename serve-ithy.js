const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8190;
const HOSTNAME = 'localhost';

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve files
    let filePath;
    if (req.url === '/' || req.url === '') {
        filePath = './ithy-interface.html';
    } else if (req.url === '/iafactory-theme.css') {
        filePath = './iafactory-theme.css';
    } else {
        filePath = '.' + req.url;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'text/html';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File not found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║         🔬  ITHY RESEARCH - SERVEUR DÉMARRÉ             ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  📍 URL:  http://${HOSTNAME}:${PORT}                          ║
║  📂 Page: ithy-interface.html                            ║
║  🛑 Stop: Ctrl+C                                         ║
║                                                          ║
║  ✅ Mixture-of-Agents prêt !                             ║
║  🤖 4 modèles de référence + 1 agrégateur                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});
