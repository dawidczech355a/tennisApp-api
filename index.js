import express from "express";
import cors from "cors";
import GameRouter from "./routes/gameResults";
import UserRouter from "./routes/createAccount";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/games", GameRouter);
app.use("/user", UserRouter);

app.listen(5000);
