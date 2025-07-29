import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/database';

export class Transaction extends Model {
  date!: string;
  amount!: number;
}

Transaction.init(
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    timestamps: true,
  }
);

export default Transaction;