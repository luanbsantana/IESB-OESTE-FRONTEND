import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'chronos-secret-key';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 12;

// ─── POST /auth/register ────────────────────────────────────────────────────
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ─── POST /auth/login ────────────────────────────────────────────────────────
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ─── POST /auth/forgot-password ──────────────────────────────────────────────
// Em ambiente de laboratório, retorna o token no JSON em vez de enviar e-mail.
// Em produção, substitua pela chamada a um serviço de e-mail (ex.: Nodemailer).
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Retorna 200 mesmo que o usuário não exista (segurança contra enumeração)
  if (!user) {
    return res.json({
      message: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  // ⚠️  LABORATÓRIO: retorna o token diretamente para o professor testar.
  // Em produção, envie por e-mail e remova este campo da resposta.
  return res.json({
    message: 'Token de redefinição gerado com sucesso.',
    resetToken,   // REMOVER em produção — apenas para fins de laboratório
    resetLink: `http://localhost:5173/reset-password?token=${resetToken}`,
  });
});

// ─── POST /auth/reset-password ───────────────────────────────────────────────
authRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body as {
    token: string;
    newPassword: string;
  };

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token inválido ou expirado.' });
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return res.json({ message: 'Senha redefinida com sucesso.' });
});

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
// Valida o token e retorna os dados do usuário atual (útil para restaurar sessão)
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

authRouter.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.json({ user });
});
