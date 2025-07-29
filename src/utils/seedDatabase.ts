import { Transaction } from '../models/transaction.model';

import bcrypt from 'bcrypt';
/**
 * WARNING: THIS WILL DROP THE CURRENT DATABASE
 */
seed();

async function seed(): Promise<void> {
  try {
    // Sync tables
    await Transaction.sync({ force: true });

    // Insert Transactions
    await Promise.all([
      Transaction.create({
        date: '01/01/2024',
        amount: 200,
      }),
      Transaction.create({
        date: '01/03/2024',
        amount: 1000,
      }),
      Transaction.create({
        date: '01/05/2024',
        amount: -500,
      }),
      Transaction.create({
        date: '05/15/2024',
        amount: 1500,
      }),
      Transaction.create({
        date: '01/06/2024',
        amount: -2000,
      }),
      Transaction.create({
        date: '01/07/2024',
        amount: 150,
      }),
      Transaction.create({
        date: '01/07/2024',
        amount: 1000,
      }),
      Transaction.create({
        date: '05/07/2024',
        amount: 500,
      }),
      Transaction.create({
        date: '07/31/2024',
        amount: -500,
      }),
      Transaction.create({
        date: '08/30/2024',
        amount: -200,
      })
    ]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}