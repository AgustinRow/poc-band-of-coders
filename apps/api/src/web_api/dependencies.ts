import { ContainerModule, decorate, injectable } from 'inversify'
import LocalSecretProvider from '~/common_service/3rd_party/fake/local_secrets_provider'
import { ISecretsProvider } from '../common_service/3rd_party/services'
import { IDBBuilder, SequelizeBuilder } from './3rd_party/sequelize'
import DBConfigProvider, { IDBConfigProvider } from './3rd_party/sequelize/config'

decorate(injectable(), LocalSecretProvider)
decorate(injectable(), DBConfigProvider)
decorate(injectable(), SequelizeBuilder)

const dependencyContainer = new ContainerModule((bind) => {
  bind<ISecretsProvider>('ISecretsProvider').to(LocalSecretProvider).inSingletonScope()
  bind<IDBConfigProvider>('IDBConfigProvider').to(DBConfigProvider).inSingletonScope()
  bind<IDBBuilder>('IDBBuilder').to(SequelizeBuilder).inSingletonScope()
})

export default dependencyContainer
