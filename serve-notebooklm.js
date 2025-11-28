const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8191;
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

    // Serve notebooklm-iafactory.html for root path
    const filePath = './notebooklm-iafactory.html';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - notebooklm-iafactory.html not found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║       📓 NOTEBOOKLM IA FACTORY - SERVEUR DÉMARRÉ        ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  📍 URL:  http://${HOSTNAME}:${PORT}                          ║
║  📂 Page: notebooklm-iafactory.html                      ║
║  🛑 Stop: Ctrl+C                                         ║
║                                                          ║
║  ✨ 3 Pages:                                             ║
║     1️⃣  Prompting + Chat NLP                            ║
║     2️⃣  Génération Auto (Audio/Vidéo/Image)             ║
║     3️⃣  Gestion Crédit/Wallet                           ║
║                                                          ║
║  🤖 Powered by BMAD + FLUX + Wan 2.2                     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});
