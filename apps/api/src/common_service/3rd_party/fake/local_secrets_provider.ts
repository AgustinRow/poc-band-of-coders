import SecretNotFoundError from '@project/errors/src/secret_not_found'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok } from '@project/result/src'
import { isNil } from 'lodash-es'
import { ISecretsProvider, Secrets } from '../services'

export default class LocalSecretProvider implements ISecretsProvider {
  async getSecretValue<Key extends keyof Secrets> (secretName: Key, version?: string): AsyncResult<Secrets[Key], SecretNotFoundError | UnknownError> {
    const emulatedSecretStore: {[key: string]: string } = {
      RELATIONAL_DB_PASSWORD: ''
    }

    const secretValue = emulatedSecretStore[secretName]
    if (isNil(secretValue)) return err(new SecretNotFoundError('Secret undefined'))

    return ok(secretValue)
  }
}
