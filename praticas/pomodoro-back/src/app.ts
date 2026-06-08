import express from 'express';
import cors from 'cors';
import { settingsRouter } from './routes/settings.routes';
import { tasksRouter } from './routes/tasks.routes';

// Correção para serialização de BigInt em JSON
(BigInt.prototype as any).toJSON = function () { return Number(this); };

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});