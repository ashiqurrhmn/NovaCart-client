const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace: const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    // with: const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*["'`]http:\/\/localhost:5000["'`]/g, 'process.env.NEXT_PUBLIC_API_URL');
    
    // Replace: fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/...
    // with: fetch(`${process.env.NEXT_PUBLIC_API_URL}/...
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*["'`]http:\/\/localhost:5000["'`]\}/g, '${process.env.NEXT_PUBLIC_API_URL}');

    // Replace regular strings: "http://localhost:5000/something"
    // with: `${process.env.NEXT_PUBLIC_API_URL}/something`
    content = content.replace(/(?<!\$\{)("http:\/\/localhost:5000)(.*?)(")/g, (match, p1, p2, p3) => {
        return '`${process.env.NEXT_PUBLIC_API_URL}' + p2 + '`';
    });

    // Replace template literals: `http://localhost:5000/something/${id}`
    // with: `${process.env.NEXT_PUBLIC_API_URL}/something/${id}`
    content = content.replace(/(`)http:\/\/localhost:5000(.*?`)/g, (match, p1, p2) => {
        return '`${process.env.NEXT_PUBLIC_API_URL}' + p2;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

walkDir('./app', processFile);
walkDir('./components', processFile);
