const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: [
    "http://localhost:5173", // Your local frontend domain
    "https://your-frontend-domain.com", // Your production frontend domain
  ],
  credentials: true, // Allow cookies and authentication
};

// Enable CORS for HTTP requests
app.use(cors(corsOptions));

// Enable CORS for WebSocket connections
const io = new Server(server, {
  cors: corsOptions,
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);

  // Listen for incoming messages from clients
  socket.on("message", (message) => {
    console.log("Received message:", message);
    // Broadcast the message to all connected clients
    io.emit("message", message);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Server is running properly");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
