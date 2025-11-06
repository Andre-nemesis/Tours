import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Sincronize modelos (apenas em dev; use migrations em prod)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ force: false }) // force: true apaga e recria tabelas
    .then(() => console.log('Modelos sincronizados!'))
    .catch(err => console.error('Erro na sincronização:', err));
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});