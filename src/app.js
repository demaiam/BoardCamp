import express from "express";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

const PORT = 5000;
app.listen(PORT,	() => console.log(`Server running on port ${PORT}`));