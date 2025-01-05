import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import todoRoutes from "./routes/todo.route.js";
import path from "path";

dotenv.config();

const app = express();

const _dirname = path.resolve();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: 'https://todolist-e1fy.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/todos", todoRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist"))); // Serve static files from frontend/dist
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Server Listening
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(); // Wait for the database to connect
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
  } catch (error) {
    console.error(error);
  }
};

start();
