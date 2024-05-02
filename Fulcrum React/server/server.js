import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.enable("trust proxy");
app.use(express.json());

// Serve static files from build
const serveStatic = express.static(path.join(__dirname, "../dist"));
app.use((req, res, next) => {
  if (req.path.endsWith(".jpg") || req.path.endsWith(".png") || req.path.endsWith(".svg") || req.path.endsWith(".webp")) {
    res.set("Cache-Control", "public, max-age=31557600"); // 1 year
  }
  next();
});
app.use(serveStatic);

app.use("/api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://backend:8080/api${req.url}`,
      data: req.body,
    });
    res.send(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Error in proxying request");
  }
});

// Delegate routing to SPA setup
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});