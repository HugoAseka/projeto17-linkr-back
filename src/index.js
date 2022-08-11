import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from "chalk";
import accessOtherUsersRouter from './routes/accessOtherUsersRoute.js';
import authRouter from './routes/authRouter.js';
import postsRouter from './routes/postsRouter.js';
import hashtagRouter from './routes/hashtagRouter.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(authRouter,accessOtherUsersRouter,postsRouter, hashtagRouter);

app.listen(process.env.PORT, () => console.log (chalk.bold.blue(`\nRodando na porta ${process.env.PORT}`)));
