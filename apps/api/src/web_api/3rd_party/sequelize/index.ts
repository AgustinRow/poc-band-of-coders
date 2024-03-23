// @ts-nocheck
import path from 'path'
import { Options, Sequelize } from 'sequelize'
import { sequelizeNamespace } from '../cls_namespaces'
import { IDBConfigProvider } from './config'
import globby from 'globby'
import { isFunction } from 'lodash-es'
import { inject } from 'inversify'
import { AsyncResult, err, ok } from '@project/result/src'
import UnknownError from '@project/errors/src/unknown_error'
import SecretNotFoundError from '@project/errors/src/secret_not_found'
import { startUpLog } from '~/utils/startup_log'
import { fileURLToPath } from 'url'

Sequelize.useCLS(sequelizeNamespace)

const dirname = fileURLToPath(new URL('.', import.meta.url))

const modelPaths = globby.sync([
  path.join(dirname, '..', '..', '..', '**', '*.model.(t|j)s')
])

const initFunctions: any[] = []
startUpLog('Loading models')
await Promise.all(
  modelPaths.map(async file => {
    startUpLog(`  Loading ${file}`)
    const start = Date.now()
    const { default: defaultExport } = await import(path.resolve(process.cwd(), file))

    if (!isFunction(defaultExport)) {
      throw new Error(`Model file ${file} does not export a function: ${String(defaultExport)}`)
    }

    initFunctions.push(defaultExport)

    startUpLog(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`)
  })
)
export interface IDBBuilder {
  build: () => AsyncResult<Sequelize, UnknownError, SecretNotFoundError>
}

export class SequelizeBuilder implements IDBBuilder {
  constructor (
    @inject('IDBConfigProvider') private readonly dbConfigProvider: IDBConfigProvider
  ) { }

  async build (): AsyncResult<Sequelize, UnknownError | SecretNotFoundError> {
    startUpLog('Sequelize builder')
    startUpLog('  calling dbConfig provider')

    const config = await this.dbConfigProvider.getConfig()

    if (config.isErr()) return err(config.error)

    const sequelize = new Sequelize(config.value as unknown as Options)

    const models = initFunctions.map(init => init(sequelize))

    for (const model of models) {
      if ('associate' in model) {
        model.associate(sequelize.models)
      }
      startUpLog(`  model [${model.getTableName() as string}] done`)
    }

    return ok(sequelize)
  }
}
