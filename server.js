const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Decode URI to prevent issue with space or special chars in filename
    let decodedUrl;
    try {
        decodedUrl = decodeURIComponent(req.url);
    } catch (e) {
        decodedUrl = req.url;
    }

    // Clean up url path
    const urlPath = decodedUrl.split('?')[0];
    let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
    
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Default back to index.html for SPA routing or missing files
            filePath = path.join(__dirname, 'index.html');
        }
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading application resource');
            } else {
                let contentType = 'text/html';
                const ext = path.extname(filePath).toLowerCase();
                if (ext === '.css') contentType = 'text/css';
                else if (ext === '.js') contentType = 'text/javascript';
                else if (ext === '.json') contentType = 'application/json';
                else if (ext === '.png') contentType = 'image/png';
                else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
                else if (ext === '.svg') contentType = 'image/svg+xml';
                else if (ext === '.ico') contentType = 'image/x-icon';
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Development server running on http://localhost:${PORT}`);
});
