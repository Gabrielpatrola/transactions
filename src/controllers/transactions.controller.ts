import { Request, Response } from 'express'
import { handleError } from '../utils/errorHandler'
import Transaction from '../models/transaction.model'
import { sequelize } from '../utils/database'

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, date } = req.body

    const balance = await getBalance()

    if (amount < 0 && balance + amount < 0) {
      return res.status(422).json('insufficient balance')
    }

    const lastTransaction = await getLatestTransaction()
    const newTransactionDate = new Date(date)

    if (lastTransaction) {
      const lastDate = new Date(lastTransaction.date)
      if (newTransactionDate < lastDate) {
        return res.status(422).json('invalid date')
      }
    }

    const result = await Transaction.create({ amount, date })

    res.status(201).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

export const getTransactions = async (_: Request, res: Response) => {
  try {
    const Transactions = await Transaction.findAll()
    res.json(Transactions)
  } catch (error) {
    handleError(res, error)
  }
}

export const getTransactionsBalance = async (_: Request, res: Response) => {
  try {
    const balance = await getBalance()
    res.json(balance)
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const Transactions = await Transaction.findAll()

    if (!Transactions) {
      res.status(404).json({ message: 'Transactions not found' })
      return
    }

    for (const item of Transactions) {
      await item.destroy()
    }

    res.status(200).json({ message: 'Transactions deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}

const getBalance = async () => {
  const allTransactions = await Transaction.findAll()

  let balance = 0
  for (const item of allTransactions) {
    balance = balance + item.amount
  }

  return balance
}

const getLatestTransaction = async () => {
  const latest = await Transaction.findAll({
    order: [['date', 'DESC']],
    limit: 1
  })

  return latest[0] || null
}

export const getSpending = async (_: Request, res: Response) => {
  try {
    const transactions = await Transaction.findAll()

    let small = 0
    let medium = 0
    let large = 0

    for (const item of transactions) {
      const absAmount = Math.abs(item.amount)
      if (item.amount < 0) {
        if (absAmount < 500) {
          small += item.amount
        } else if (absAmount < 1000) {
          medium += item.amount
        } else {
          large += item.amount
        }
      }
    }

    res.json({ small, medium, large })
  } catch (error) {
    handleError(res, error)
  }
}

export const getMonthlyAnalysis = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.params
    
    const monthQuery = `${year}-${month.padStart(2, '0')}`
    
    console.log('Searching for month:', monthQuery)

    const transactions = await Transaction.findAll({
      where: sequelize.where(
        sequelize.fn('substr', sequelize.col('date'), 1, 7),
        monthQuery
      )
    })

    let income = 0
    let expenses = 0

    for (const transaction of transactions) {
      if (transaction.amount > 0) {
        income += transaction.amount
      } else {
        expenses += transaction.amount
      }
    }

    const balance = income + expenses

    res.json({ income, expenses, balance })
  } catch (error) {
    console.error('Error:', error)
    handleError(res, error)
  }
}
