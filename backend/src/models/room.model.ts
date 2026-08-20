import { DataTypes } from '@sequelize/core';

import { sequelize } from '../config/db';

export const Room = sequelize.define(
  'Room',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'rooms',
    timestamps: true,
  },
);