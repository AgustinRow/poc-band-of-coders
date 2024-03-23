import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return await queryInterface.createTable('auth_single_use_code', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: DataTypes.UUIDV4
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return await queryInterface.dropTable('authSingleUseCode')
  }
}
