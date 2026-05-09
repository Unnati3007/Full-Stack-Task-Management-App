require("dotenv").config();
const http = require("http");
const { WebSocketServer } = require("ws");
const app = require("./app");

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
app.set("broadcast", (data) => {
  wss.clients.forEach((c) => c.readyState === 1 && c.send(JSON.stringify(data)));
});
wss.on("connection", (ws) => ws.send(JSON.stringify({ type: "connected" })));
server.listen(process.env.PORT || 5000, () => console.log("Server up on port", process.env.PORT || 5000));
