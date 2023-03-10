const http = require("http");
const httpProxy = require("http-proxy");
const url = require("url");

// Create a whitelist of allowed IP addresses
const whitelist = [
  process.env.WHITELIST_IP1,
  process.env.WHITELIST_IP2,
  process.env.WHITELIST_IP3,
];
// const whitelist = ["52.41.36.82", "54.191.253.12", "44.226.122.3"];

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({});

// Create a HTTP server that will listen on a port
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://chirp.ddns.net");
  console.log(res);
  console.log("forwarding to backend");
  try {
    // Forward the request to the backend web server
    proxy.web(req, res, {
      target: "https://messaging-auth-backend.onrender.com/" + req.url,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error(`Error proxying request: ${err.message}`);
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end("Error proxying request");
  }
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
