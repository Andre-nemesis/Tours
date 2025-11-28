// middlewares/corsMiddleware.js
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin (Expo Go no celular) e com origin
    if (!origin || origin === 'null' || origin.includes('localhost') || origin.includes('ngrok')) {
      return callback(null, true);
    }
    // Em produção você pode colocar uma whitelist aqui
    callback(null, true); // ou sua lógica de whitelist
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

export default cors(corsOptions);