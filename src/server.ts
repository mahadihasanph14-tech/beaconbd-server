import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import eventsRouter from "./routes/events.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "social-development-api" }));
app.use("/api/events", eventsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch(error => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
