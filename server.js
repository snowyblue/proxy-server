const http = require("http");
const httpProxy = require("http-proxy");

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(res);

  // Check if the incoming request is from an allowed IP address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(req.socket.remoteAddress);
  console.log(req.headers["x-forwarded-for"]);
  console.log("ip: " + ip);
  if (!whitelist.includes(ip)) {
    res.statusCode = 403;
    console.log("access denied");
    res.end("Access Denied");
    return;
  }

  console.log("forwarding to backend");
  // Forward the request to the backend web server
  proxy.web(req, res, {
    target: "https://messaging-auth-backend.onrender.com",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
