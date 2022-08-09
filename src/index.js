import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from "chalk";
import authRouter from './routes/authRouter.js';
import accessOtherUsersRouter from './routes/accessOtherUsersRoute.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(authRouter,accessOtherUsersRouter);


app.listen(process.env.PORT, () => console.log (chalk.bold.blue(`\nRodando na porta ${process.env.PORT}`)));