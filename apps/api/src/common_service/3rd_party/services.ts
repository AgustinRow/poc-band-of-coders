import SecretNotFoundError from '@project/errors/src/secret_not_found'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult } from '@project/result/src'

export interface Secrets {
  RELATIONAL_DB_PASSWORD: string
}

export interface ISecretsProvider {
  getSecretValue: <Key extends keyof Secrets>(
    secretName: Key, version?: string
  ) => AsyncResult<Secrets[Key], SecretNotFoundError | UnknownError>
}
