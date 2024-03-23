import cls from 'cls-hooked'
import { SEQUELIZE_NAMESPACE, REQUEST_NAMESPACE } from './constants'

const sequelizeNamespace = cls.createNamespace(SEQUELIZE_NAMESPACE)
const requestNamespace = cls.createNamespace(REQUEST_NAMESPACE)

export { sequelizeNamespace, requestNamespace }
