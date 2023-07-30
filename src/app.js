import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.routes";

const app = express();

app.use(cors);
app.use(express.json());
app.use(router);
dotenv.config();

const PORT = 5000;
app.listen(PORT,	() => console.log(`Server running on port ${PORT}`));