import { DataTypes } from '@sequelize/core';

import { sequelize } from '../config/db';

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  },
);