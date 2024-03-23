import { DataTypes, Model, Sequelize } from 'sequelize'

export interface PropertyAttributes{
  id: string
  apartmentNumber: string
  complex: string
  surname: string
  createdAt: Date
  updatedAt?: Date
}

export type PropertyCreateAttributes = Omit<PropertyAttributes, 'id' | 'createdAt' | 'updatedAt'>
export type PropertyUpdateAttributes = Partial<Omit<PropertyAttributes, 'id' >>

export class Property extends Model<PropertyAttributes, PropertyCreateAttributes> implements PropertyAttributes {
  declare public id: string
  declare public apartmentNumber: string
  declare public complex: string
  declare public surname: string
  declare public createdAt: Date
  declare public updatedAt?: Date
}

export default (sequelize: Sequelize): typeof Property => {
  Property.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      apartmentNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      complex: {
        type: DataTypes.STRING,
        allowNull: false
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      }
    },
    {
      modelName: 'Property',
      tableName: 'property',
      sequelize
    }
  )

  return Property
}
