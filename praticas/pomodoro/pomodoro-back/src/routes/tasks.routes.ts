import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const tasksRouter = Router();

tasksRouter.get('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
  });

  return res.json(tasks);
});

tasksRouter.post('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  const task = await prisma.task.create({
    data: { id, name, duration, type, startDate: BigInt(startDate), userId },
  });

  return res.status(201).json(task);
});

tasksRouter.patch('/:id/complete', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };

  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

  const updated = await prisma.task.update({
    where: { id },
    data: { completeDate: BigInt(completeDate) },
  });

  return res.json(updated);
});

tasksRouter.patch('/:id/interrupt', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };

  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

  const updated = await prisma.task.update({
    where: { id },
    data: { interruptDate: BigInt(interruptDate) },
  });

  return res.json(updated);
});

tasksRouter.delete('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  await prisma.task.deleteMany({ where: { userId } });
  return res.status(204).send();
});
