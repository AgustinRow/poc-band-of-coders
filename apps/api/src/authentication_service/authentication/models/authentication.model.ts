import { DataTypes, Model, Sequelize } from 'sequelize'

export interface AuthSingleUseCodeAttributes {
  id: string
  complex: string
  singleUseCode: string
  expireAt: number
  alreadyUsed: boolean
  createdAt: Date
  updatedAt?: Date
}

export type AuthSingleUseCodeCreateAttributes = Omit<AuthSingleUseCodeAttributes, 'id' | 'createdAt' | 'updatedAt'>

export class AuthSingleUseCode extends Model<AuthSingleUseCodeAttributes, AuthSingleUseCodeCreateAttributes>
  implements AuthSingleUseCodeAttributes {
  declare public complex: string
  declare public id: string
  declare public singleUseCode: string
  declare public expireAt: number
  declare public alreadyUsed: boolean

  declare public createdAt: Date
  declare public updatedAt?: Date

  static associate (): void {
  }
}

export default (sequelize: Sequelize): typeof AuthSingleUseCode => {
  AuthSingleUseCode.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
      },
      complex: {
        type: DataTypes.STRING,
        allowNull: false
      },
      singleUseCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expireAt: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      alreadyUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {
      modelName: 'AuthSingleUseCode',
      tableName: 'auth_single_use_code',
      sequelize
    }
  )

  return AuthSingleUseCode
}
