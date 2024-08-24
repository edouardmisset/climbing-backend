import { DataTypes, Model } from 'denodb'
import { z } from 'zod'

export class Ascent extends Model {
  static table = 'ascent'
  static timestamps = true

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeName: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 50,
    },
    topoGrade: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 5,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }

  static defaults = {
    date: new Date(),
  }
}

export const simplifiedAscentSchema = z.object({
  routeName: z.string(),
  topoGrade: z.string(),
  date: z.string(),
})
