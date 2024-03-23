import UnknownError from '@project/errors/src/unknown_error'
import { err, ok, AsyncResult } from '@project/result/src'
import { IAuthSingleUseCode, IAuthSingleUseCodeCreated, IAuthenticationSingleUseCodeRepository } from '../use_cases/interfaces'
import NotFoundError from '@project/errors/src/not_found_error'
import { AuthSingleUseCode } from '../models/authentication.model'
import { isNil } from 'lodash-es'
import { Op } from 'sequelize'

export class SequelizeAuthenticationSingleUseCodeRepository implements IAuthenticationSingleUseCodeRepository {
  async getSingleUseCode (singleUseCode: string): AsyncResult<IAuthSingleUseCode, UnknownError | NotFoundError> {
    try {
      const authSingleUseCode = await AuthSingleUseCode.findOne({ where: { singleUseCode } })
      if (isNil(authSingleUseCode)) return err(new NotFoundError('Single use code not found'))
      return ok(authSingleUseCode)
    } catch (error) {
      return err(new UnknownError('Failed to fetch single use code', error))
    }
  }

  async validateSingleUseCode (complex: string, currentTime: number): AsyncResult<boolean, UnknownError | NotFoundError> {
    try {
      const complexCodes = await AuthSingleUseCode.findOne({
        where: {
          complex,
          alreadyUsed: false,
          expireAt: {
            [Op.gte]: currentTime
          }
        },
        order: [['createdAt', 'DESC']]
      })
      if (isNil(complexCodes)) return ok(false)

      return ok(true)
    } catch (error) {
      return err(new UnknownError('Failed to find single use code', error))
    }
  }

  async saveSingleUseCode (input: IAuthSingleUseCode): AsyncResult<IAuthSingleUseCodeCreated, UnknownError> {
    try {
      const { complex, singleUseCode, expireAt } = input
      const savedSingleUseCode = await AuthSingleUseCode.create({ complex, singleUseCode, expireAt, alreadyUsed: false })
      if (isNil(savedSingleUseCode)) return err(new UnknownError('Single use code not saved'))

      return ok(savedSingleUseCode)
    } catch (error) {
      return err(new UnknownError('Failed to insert single use code', error))
    }
  }

  async disableSingleUseCode (singleUseCode: string): AsyncResult<IAuthSingleUseCode, UnknownError | NotFoundError> {
    try {
      const authSingleUseCode = await AuthSingleUseCode.findOne({ where: { singleUseCode } })
      if (isNil(authSingleUseCode)) return err(new NotFoundError('single use code not found'))

      const authSingleUseCodeUpdated = await authSingleUseCode.update({ alreadyUsed: true })
      if (authSingleUseCodeUpdated === null) return err(new UnknownError('could not update single use code'))

      return ok(authSingleUseCode)
    } catch (error) {
      return err(new UnknownError('Failed to disable single use code', error))
    }
  }
}
