import request from 'supertest'
import app from '../../src/app'
import { sequelize } from '../../src/utils/database'
import Transaction from '../../src/models/transaction.model'

describe('Transaction API', () => {
  beforeAll(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await Transaction.destroy({ where: {} })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  const sampleTransactions = [
    { date: '2024-01-01T00:00:00.000Z', amount: 200 },
    { date: '2024-01-03T00:00:00.000Z', amount: 1000 },
    { date: '2024-01-05T00:00:00.000Z', amount: -500 },
    { date: '2024-05-15T00:00:00.000Z', amount: 1500 },
    { date: '2024-01-06T00:00:00.000Z', amount: -2000 },
  ]

  describe('POST /', () => {
    it('should create a new transaction', async () => {
      const transaction = { date: '2024-01-01T00:00:00.000Z', amount: 100 }
      const response = await request(app)
        .post('/transactions')
        .send(transaction)

      expect(response.status).toBe(201)
      expect(response.body.amount).toBe(transaction.amount)
      expect(response.body.date).toBe(transaction.date)
    })

    it('should reject transaction with insufficient balance', async () => {
      const response = await request(app)
        .post('/transactions')
        .send({ date: '2024-01-01T00:00:00.000Z', amount: -1000 })

      expect(response.status).toBe(422)
      expect(response.body).toBe('insufficient balance')
    })

    it('should reject transaction with invalid date order', async () => {
      await Transaction.create({
        date: '2024-02-01T00:00:00.000Z',
        amount: 100,
      })

      const response = await request(app)
        .post('/transactions')
        .send({ date: '2022-01-01T00:00:00.000Z', amount: 100 })

      expect(response.status).toBe(422)
      expect(response.body).toBe('invalid date')
    })
  })

  describe('GET /', () => {
    it('should return all transactions', async () => {
      await Transaction.bulkCreate(sampleTransactions)

      const response = await request(app).get('/transactions')

      expect(response.status).toBe(200)
      expect(response.body.length).toBe(sampleTransactions.length)
    })
  })

  describe('GET /balance', () => {
    it('should return correct balance', async () => {
      await Transaction.bulkCreate(sampleTransactions)

      const response = await request(app).get('/transactions/balance')

      const expectedBalance = sampleTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      )
      expect(response.status).toBe(200)
      expect(response.body).toBe(expectedBalance)
    })
  })

  describe('GET /monthly/:month/:year', () => {
    it('should return correct monthly analysis', async () => {
      await Transaction.bulkCreate(sampleTransactions)

      const response = await request(app).get('/transactions/monthly/01/2024')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        income: 1200, // 200 + 1000
        expenses: -2500, // -500 + -2000
        balance: -1300,
      })
    })

    it('should return zero values for month with no transactions', async () => {
      await Transaction.bulkCreate(sampleTransactions)

      const response = await request(app).get('/transactions/monthly/03/2024')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        income: 0,
        expenses: 0,
        balance: 0,
      })
    })
  })

  describe('GET /spending', () => {
    it('should categorize expenses correctly', async () => {
      await Transaction.bulkCreate(sampleTransactions)

      const response = await request(app).get('/transactions/spending')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        small: 0,
        medium: -500,
        large: -2000,
      })
    })
  })

  describe('DELETE /deleteAll', () => {
    it('should delete all transactions', async () => {
      await Transaction.bulkCreate(sampleTransactions)

      const response = await request(app).delete('/transactions/deleteAll')

      expect(response.status).toBe(200)

      const transactions = await Transaction.findAll()
      expect(transactions.length).toBe(0)
    })
  })
})
