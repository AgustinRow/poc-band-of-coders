import { SchemaOf } from 'yup'
import { AsyncResult, err, ok, Result } from '@project/result/src'
import InvalidObjectSchemaError from '@project/errors/src/invalid_object_schema_error'

export function validateAt<T, K extends Extract<keyof T, string>, S> (schema: SchemaOf<T>, path: K, value: S): Result<void, InvalidObjectSchemaError> {
  try {
    schema.validateSyncAt(path, { [path]: value }, { strict: true })
    return ok()
  } catch (error) {
    return err(new InvalidObjectSchemaError('The field that you verify does not satisfied the validation schema', error, path))
  }
}

export async function validate<T, S> (schema: SchemaOf<T>, input: S): AsyncResult<void, InvalidObjectSchemaError> {
  try {
    await schema.validate(input)
    return ok()
  } catch (error) {
    return err(new InvalidObjectSchemaError('The object that you verify does not satisfied the validation schema', error))
  }
}
