import { AsyncResult, ok } from '@project/result/src'
import UnknownError from '@project/errors/src/unknown_error'
import SecretNotFoundError from '@project/errors/src//secret_not_found'
import {
  RELATIONAL_DB_DIALECT,
  RELATIONAL_DB_STORAGE_LOCAL,
  IS_LOCAL
} from '~/web_api/constants_common'
import { startUpLog } from '~/utils/startup_log'

export interface DbConfig {
  logging?: boolean
  dialect: string
  storage: string
  define?: {
    freezeTableName: boolean
  }
}

export interface IDBConfigProvider {
  getConfig: () => AsyncResult<DbConfig, UnknownError | SecretNotFoundError>
}

export default class DBConfigProvider implements DBConfigProvider {
  async getConfig (): AsyncResult<DbConfig, UnknownError | SecretNotFoundError> {
    startUpLog('  calling secrets provider')
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions

    return ok({
      dialect: RELATIONAL_DB_DIALECT ?? 'sqlite',
      storage: RELATIONAL_DB_STORAGE_LOCAL,
      logging: IS_LOCAL,
      define: {
        freezeTableName: true
      }
    })
  }
}
