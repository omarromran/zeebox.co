const http = require("http");
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4" };
http.createServer((request, response) => {
  let file = path.join(root, decodeURIComponent(request.url.split("?")[0] || "/index.html"));
  if (request.url === "/") file = path.join(root, "index.html");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.statusCode = 404; response.end("Not found"); return; }
  response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(response);
}).listen(4173, "127.0.0.1");
