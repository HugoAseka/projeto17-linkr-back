import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import postsRouter from './routes/postsRouter.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(postsRouter);

app.listen(process.env.PORT, () => console.log ('Rodando'));