import { Router } from 'express';
import { getTransactions, deleteTransactions, getTransactionsBalance, createTransaction, getSpending, getMonthlyAnalysis } from '../controllers/transactions.controller';

const router = Router();

router.get('/', getTransactions);
router.get('/balance', getTransactionsBalance);
router.post('/', createTransaction);
router.get('/spending', getSpending);
router.get('/monthly/:month/:year', getMonthlyAnalysis);
router.delete('/deleteAll', deleteTransactions);

export default router; 