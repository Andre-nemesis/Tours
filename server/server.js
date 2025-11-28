// server.js
import express from 'express';
import corsMiddleware from './middlewares/corsMiddleware.js';
import { logger } from './middlewares/loggerMiddleware.js';
import app from './index.js'; // só as rotas

const PORT = process.env.PORT || 3000;
const server = express();

// Normaliza header minúsculo (Android manda content-type)
server.use((req, res, next) => {
  if (req.headers['content-type']) {
    req.headers['Content-Type'] = req.headers['content-type'];
  }
  next();
});

// BODY PARSER ÚNICO E CORRETO (com rawBody pra debug)
server.use(express.json({ limit: '10mb' }));
server.use(express.raw({ type: 'application/json', limit: '10mb' })); // fallback
server.use((req, res, next) => {
  if (req.rawBody && !req.body) {
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {}
  }
  next();
});

// CORS + Logger
server.use(corsMiddleware);
server.use(logger);

// Monta as rotas (agora sem body-parser duplicado)
server.use(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server rodando na porta ${PORT}`);
});