import abind from 'abind'
import { IUseCaseFinders } from '../use_cases/types'
import { IControllerFinders } from './types'

export default class ControllerFinders<T extends {id: string}, F = unknown> implements IControllerFinders<T, F> {
  constructor (
    protected readonly useCases: IUseCaseFinders<T, F>
  ) {
    abind(this)
  }

  findById = this.useCases.findById
  findAll = this.useCases.findAll
}
