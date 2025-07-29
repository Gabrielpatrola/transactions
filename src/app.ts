import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

import { sequelize } from './utils/database';

// Routes
import transactionsRoutes from './routes/transactions.routes';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' })
})

app.use('/transactions', transactionsRoutes)

export default app;