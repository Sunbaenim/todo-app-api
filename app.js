import express from 'express';
import mongoose from 'mongoose';
import taskRouter from './routes/task.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const username = encodeURIComponent('admin');
const password = encodeURIComponent('#Test1234=');
const cluster = encodeURIComponent('todo-app.t4xhgbp.mongodb.net');
mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`);

app.use(taskRouter);

app.listen(3000, () => console.log('Server opened on port 3000'));