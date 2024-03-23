import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return await queryInterface.createTable('property', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
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
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return await queryInterface.dropTable('property')
  }
}
